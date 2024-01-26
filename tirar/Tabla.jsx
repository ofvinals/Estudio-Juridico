import { useMemo } from 'react';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';


const Tabla = ({ columns, data, user }) => {
	const table = useMaterialReactTable({
		columns,
		data,
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableGlobalFilterModes: true,
		enableColumnPinning: true,
		// enableFacetedValues: true,
		enableRowActions: true,
      enableGrouping: true,

		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		localization:  MRT_Localization_ES,
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
		renderRowActions:({ row, table }) => (
         <Box
            sx={{
               display: 'flex',
               flexWrap: 'nowrap',
               gap: '3px',
            }}>
            <IconButton
               color='primary'
               onClick={() => {
                  navigate(
                     `/gestionmovimientos/${row.original._id}`
                  );
               }}>
               <VisibilityIcon />
            </IconButton>
            {user === 'admin@gmail.com' && (
               <IconButton
                  color='success'
                  onClick={() => {
                     navigate(
                        `/editarexptes/${row.original._id}`
                     );
                  }}>
                  <EditIcon />
               </IconButton>
            )}
            {user === 'admin@gmail.com' && (
               <IconButton
                  color='error'
                  onClick={() => borrarExpte(row.original._id)}>
                  <DeleteIcon />
               </IconButton>
            )}
         </Box>
      ),
            })

	return <MaterialReactTable table={table} />;
};

export default Tabla;
