import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = "Nenhum registro encontrado.",
}) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <p className="text-center text-gray-500 py-4">{emptyMessage}</p>;
  }

  if (safeColumns.length === 0) {
    return <p className="text-center text-gray-500 py-4">Defina as colunas da tabela antes de renderizá-la.</p>;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {safeColumns.map((col) => (
              <TableHead key={col.key} className="font-semibold">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {safeColumns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}