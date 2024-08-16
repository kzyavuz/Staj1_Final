import React from 'react';
import { useSnackbar } from 'notistack';

function NotificationSnackbar({ message, severity = 'success', onClose }) {
	const { enqueueSnackbar } = useSnackbar();

	React.useEffect(() => {
		if (message) {
			enqueueSnackbar(message, {
				variant: severity,
				autoHideDuration: 3000,
				onClose: () => {
					if (onClose) {
						onClose();
					}
				},
			});
		}
	}, [message, severity, enqueueSnackbar, onClose]);

	return null;
}

export default NotificationSnackbar;
