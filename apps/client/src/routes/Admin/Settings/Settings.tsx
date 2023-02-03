import SaveIcon from '@mui/icons-material/Save';
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
import moment from 'moment';
import { useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import type { SettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { DesktopDatePickerElement } from '../../../components/DesktopDatePickerElement';
import { InfoDialog } from '../../../components/InfoDialog';
import { TextFieldElement } from '../../../components/TextFieldElement';
import { ACCESS_TOKEN, ADMIN, ERROR_MESSAGES } from '../../../constants';
import { htmlService, settingsService } from '../../../services';
import { formatISOEndOfDay, formatISOStartOfDay } from '../../../utils';
import { ROUTES } from '../../routes.config';

const toolbar = {
  options: ['inline', 'fontSize', 'list', 'link', 'remove', 'history'],
};

export const Settings: React.FC = () => {
  const startDateRef = useRef<string>();
  const endDateRef = useRef<string>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const form = useForm<Serialized<SettingsDto>>();
  const [addresses, setAddresses] = useState(EditorState.createEmpty());

  const settingsResponse = useAsync(async () => {
    const settings = await settingsService.getSettings();
    startDateRef.current = settings.startOfRegistrationDate;
    endDateRef.current = settings.endOfRegistrationDate;
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
    return info.content;
  });

  const isSettingsChanged = (formValues: Serialized<SettingsDto>) =>
    settingsResponse.value?.daysToNextVpoRegistration !==
      formValues.daysToNextVpoRegistration ||
    settingsResponse.value?.startOfRegistrationDate !==
      formValues.startOfRegistrationDate ||
    settingsResponse.value?.endOfRegistrationDate !==
      formValues.endOfRegistrationDate ||
    settingsResponse.value?.scheduleDaysAvailable !==
      formValues.scheduleDaysAvailable;

  const isInfoChanged = () =>
    addresses &&
    infoResponse.value?.['addresses'] !==
      draftToHtml(convertToRaw(addresses.getCurrentContent()));

  const saveSettings: SubmitHandler<Serialized<SettingsDto>> = async (
    formValues,
  ) => {
    try {
      setLoading(true);
      if (isSettingsChanged(formValues)) {
        const data = await settingsService.saveSettings({
          daysToNextVpoRegistration:
            parseInt(formValues.daysToNextVpoRegistration.toString()) || 0,
          startOfRegistrationDate: formValues.startOfRegistrationDate,
          endOfRegistrationDate: formValues.endOfRegistrationDate,
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
        await htmlService.updatePage('info', { content });
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          return navigate(ROUTES.LOGIN.path, { replace: true });
        }
        setErrorMessage(error.response?.data.message);
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
    return (
      <InfoDialog
        isOpen={true}
        title={ADMIN.infoDialog.errorTitle}
        message={(settingsResponse.error || infoResponse.error)!.message}
      >
        <DialogActions>
          <Button variant="contained" onClick={() => setIsModalOpen(false)}>
            {ADMIN.infoDialog.closeButton}
          </Button>
        </DialogActions>
      </InfoDialog>
    );
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
                  width: { xs: '100%', md: '400px' },
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
                  width: { xs: '100%', md: '400px' },
                }}
              />
            </Stack>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 2, lg: 3 }}
              sx={{ py: 3 }}
            >
              <DesktopDatePickerElement
                required
                ignoreInvalidInputs
                name="startOfRegistrationDate"
                label={ADMIN.settings.form.startOfRegistrationDate}
                helperText={ADMIN.settings.form.startOfRegistrationDateHelper}
                control={form.control}
                transform={formatISOStartOfDay}
                rules={{
                  validate: {
                    mustBeBeforeEndDate: (value) => {
                      const endDate = form.watch('endOfRegistrationDate');
                      return value && !moment(value).isBefore(endDate)
                        ? ADMIN.settings.form
                            .startOfRegistrationDateBeforeEndError
                        : undefined;
                    },
                  },
                }}
                sx={{ width: { xs: '100%', md: '400px' } }}
              />
              <DesktopDatePickerElement
                required
                ignoreInvalidInputs
                name="endOfRegistrationDate"
                label={ADMIN.settings.form.endOfRegistrationDate}
                helperText={ADMIN.settings.form.endOfRegistrationDateHelper}
                control={form.control}
                transform={formatISOEndOfDay}
                sx={{ width: { xs: '100%', md: '400px' } }}
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
            <Fab
              type="submit"
              color="primary"
              title={ADMIN.saveButton}
              disabled={!form.formState.isDirty && !isInfoChanged()}
              sx={{
                position: 'fixed',
                top: 'calc(100vh - 72px)',
                left: 'calc(100vw - 85px)',
              }}
            >
              <SaveIcon />
            </Fab>
          </Box>
        )}
        <InfoDialog
          isOpen={isModalOpen}
          title={ADMIN.infoDialog.errorTitle}
          message={ADMIN.infoDialog.errorContent}
          detailedMessage={errorMessage}
          onClose={() => setIsModalOpen(false)}
        >
          <DialogActions>
            <Button variant="contained" onClick={() => setIsModalOpen(false)}>
              {ADMIN.infoDialog.closeButton}
            </Button>
          </DialogActions>
        </InfoDialog>
      </Paper>
    </Container>
  );
};
