import { Save as SaveIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import type { SettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import {
  DesktopDatePickerElement,
  TextFieldElement,
} from '../../../components';
import { ACCESS_TOKEN, ADMIN, ERROR_MESSAGES } from '../../../constants';
import { htmlService, settingsService } from '../../../services';
import { formatISOOnlyDate } from '../../../utils';
import { ROUTES } from '../../routes.config';

const toolbar = {
  options: ['inline', 'fontSize', 'list', 'link', 'remove', 'history'],
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<Serialized<SettingsDto>>();
  const [addresses, setAddresses] = useState(EditorState.createEmpty());
  const [schedule, setSchedule] = useState(EditorState.createEmpty());

  const settingsResponse = useAsync(async () => {
    const settings = await settingsService.getSettings();
    form.reset(settings);
    return settings;
  });

  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    const addressesContentBlock = info.content['addresses']
      ? htmlToDraft(info.content['addresses'])
      : undefined;
    if (addressesContentBlock) {
      setAddresses(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            addressesContentBlock.contentBlocks,
          ),
        ),
      );
    }
    const scheduleContentBlock = info.content['schedule']
      ? htmlToDraft(info.content['schedule'])
      : undefined;
    if (scheduleContentBlock) {
      setSchedule(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(scheduleContentBlock.contentBlocks),
        ),
      );
    }
    return info.content;
  });

  const isSettingsChanged = (formValues: Serialized<SettingsDto>) =>
    settingsResponse.value?.daysToNextVpoRegistration !==
      formValues.daysToNextVpoRegistration ||
    settingsResponse.value?.endOfWarDate !== formValues.endOfWarDate ||
    settingsResponse.value?.scheduleDaysAvailable !==
      formValues.scheduleDaysAvailable;

  const isInfoChanged = () =>
    (addresses &&
      infoResponse.value?.['addresses'] !==
        draftToHtml(convertToRaw(addresses.getCurrentContent()))) ||
    (schedule &&
      infoResponse.value?.['schedule'] !==
        draftToHtml(convertToRaw(schedule.getCurrentContent())));

  const saveSettings: SubmitHandler<Serialized<SettingsDto>> = async (
    formValues,
  ) => {
    try {
      setLoading(true);
      if (isSettingsChanged(formValues)) {
        const data = await settingsService.saveSettings({
          daysToNextVpoRegistration:
            parseInt(formValues.daysToNextVpoRegistration.toString()) || 0,
          endOfWarDate: formValues.endOfWarDate,
          scheduleDaysAvailable:
            parseInt(formValues.scheduleDaysAvailable.toString()) || 0,
        });
        form.reset(data);
      }

      if (isInfoChanged()) {
        const content: Record<string, string> = {};
        if (addresses) {
          content['addresses'] = draftToHtml(
            convertToRaw(addresses.getCurrentContent()),
          );
        }
        if (schedule) {
          content['schedule'] = draftToHtml(
            convertToRaw(schedule.getCurrentContent()),
          );
        }
        await htmlService.updatePage('info', { content });
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          return navigate(ROUTES.LOGIN.path, { replace: true });
        }
      }
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  if (settingsResponse.error || infoResponse.error) {
    if (
      settingsResponse.error instanceof AxiosError &&
      settingsResponse.error.response?.status === 401
    ) {
      return <Navigate to={ROUTES.LOGIN.path} />;
    }
    console.error(
      settingsResponse.error?.stack ||
        settingsResponse.error ||
        infoResponse.error?.stack ||
        infoResponse.error,
    );
    return <Typography variant="h3">{ERROR_MESSAGES.unknown}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Paper>
        {settingsResponse.loading || infoResponse.loading || loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 30px)',
            }}
          >
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Box
            component="form"
            noValidate
            onSubmit={form.handleSubmit(saveSettings)}
            px={2}
          >
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
              {ADMIN.settings.title}
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 2, lg: 3 }}
              sx={{ py: 3 }}
            >
              <TextFieldElement
                required
                type="number"
                name="daysToNextVpoRegistration"
                label={ADMIN.settings.form.daysToNextVpoRegistration}
                control={form.control}
                rules={{
                  min: { value: 1, message: ERROR_MESSAGES.min },
                }}
                sx={{
                  width: '300px',
                }}
              />
              <DesktopDatePickerElement
                required
                ignoreInvalidInputs
                name="endOfWarDate"
                label={ADMIN.settings.form.endOfWarDate}
                control={form.control}
                transform={formatISOOnlyDate}
                sx={{
                  width: '300px',
                }}
              />
              <TextFieldElement
                required
                type="number"
                name="scheduleDaysAvailable"
                label={ADMIN.settings.form.scheduleDaysAvailable}
                control={form.control}
                rules={{
                  min: { value: 1, message: ERROR_MESSAGES.min },
                  max: { value: 31, message: ERROR_MESSAGES.max },
                }}
                sx={{
                  width: '400px',
                }}
              />
            </Stack>
            <Box pb={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {ADMIN.settings.form.addresses}
              </Typography>
              <Editor
                toolbar={toolbar}
                editorState={addresses}
                editorStyle={{
                  border: 'solid 1px rgba(0, 0, 0, 0.23)',
                  padding: '0 15px',
                }}
                onEditorStateChange={(value) => setAddresses(value)}
              />
            </Box>
            <Box pb={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {ADMIN.settings.form.schedule}
              </Typography>
              <Editor
                toolbar={toolbar}
                editorState={schedule}
                editorStyle={{
                  border: 'solid 1px rgba(0, 0, 0, 0.23)',
                  padding: '0 15px',
                }}
                onEditorStateChange={(value) => setSchedule(value)}
              />
            </Box>
            <Fab
              type="submit"
              color="primary"
              title={ADMIN.saveButton}
              disabled={!form.formState.isDirty && !isInfoChanged()}
              sx={{
                position: 'fixed',
                top: 'calc(100vh - 72px)',
                left: 'calc(100vw - 72px)',
              }}
            >
              <SaveIcon />
            </Fab>
          </Box>
        )}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle id="alert-dialog-title">
            {ADMIN.errorModal.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {ADMIN.errorModal.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="contained"
              autoFocus
            >
              {ADMIN.errorModal.closeButton}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};
