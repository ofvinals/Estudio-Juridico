import { useMemo } from 'react';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';

import { MRT_Localization_ES } from 'material-react-table/locales/es';

const Tabla = ({ columns, data, renderRowActions }) => {
	const table = useMaterialReactTable({
		columns,
		data,
		renderRowActions,
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableGlobalFilterModes: true,
		enableColumnPinning: true,
		enableRowActions: true,
		enableGrouping: true,
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		localization: MRT_Localization_ES,
		muiSearchTextFieldProps: {
			size: 'medium',
			variant: 'outlined',
		},
		muiPaginationProps: {
			color: 'secondary',
			rowsPerPageOptions: [5, 10, 20, 30],
			shape: 'rounded',
			variant: 'outlined',
		},
      
		
	});

	return (
		<Box>
			<MaterialReactTable table={table} />
		</Box>
	);
};

export default Tabla;
