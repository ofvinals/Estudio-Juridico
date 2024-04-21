import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import PropTypes from 'prop-types';

export const Table = ({ columns, data, actions }) => {
	Table.propTypes = {
		columns: PropTypes.array.isRequired,
		data: PropTypes.array.isRequired,
		actions: PropTypes.arrayOf(
			PropTypes.shape({
				onClick: PropTypes.func.isRequired,
				icon: PropTypes.node.isRequired,
			})
		).isRequired,
	};

	const table = useMaterialReactTable({
		columns,
		data: data || [],
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
			color: 'primary',
			rowsPerPageOptions: [5, 10, 20, 30],
			shape: 'rounded',
			variant: 'outlined',
		},
		renderRowActions: ({ row }) => (
			<Box sx={{}}>
				<div className='d-flex flex-row flex-nowrap'>
					{actions.map((action, index) => (
						<span
							key={index}
							className=' mx-2'
							onClick={() => action.onClick && action.onClick(row)}>
							{action.icon}
						</span>
					))}
				</div>
			</Box>
		),
	});

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<div className=''>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<MaterialReactTable table={table} />
			</ThemeProvider>
		</div>
	);
};
