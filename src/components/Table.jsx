import {
	flexRender,
	useReactTable,
	getCoreRowModel,
} from '@tanstack/react-table';
import React from 'react';
import { useGastos } from '../context/GastosContext.jsx';

export const Table = () => {
	const { getGastos, deleteGasto, gastos } = useGastos();
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getGastos();
				cargarTablaGastos(data);
			} catch (error) {
				console.error('Error al obtener gastos', error);
			}
		};
		fetchData();
	}, []);

	const columns = React.useMemo(
		() => [
			{
				header: 'Nro Expte',
				accessorKey: 'nroexpte',
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
			},
			{
				header: 'Concepto',
				accessorKey: 'concepto',
			},
			{
				header: 'Comprobante',
				accessorKey: 'comprobante',
			},
			{
				header: 'Monto',
				accessorKey: 'monto',
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
			},
		],
		[]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{flexRender(header.column.columnDef.header, header.getContext)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cel) => (
								<td>{flexRender(cel.column.columnDef.cell, cel.getContext)}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
