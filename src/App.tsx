import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import "./App.css";
import { useTableConfig } from "./hooks/useTableConfig";

type Sandwich = {
  name: string;
  price: number;
  vegan: boolean;
};

const data: Sandwich[] = [
  {
    name: "Classic Club Sandwich",
    price: 7.99,
    vegan: false,
  },
  {
    name: "Mushroom Monster",
    price: 8.99,
    vegan: true,
  },
  {
    name: "Mach Special",
    price: 10.0,
    vegan: false,
  },
];

const App = () => {
  const columns: ColumnDef<Sandwich>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (data) =>
        new Intl.NumberFormat("en-EN", {
          style: "currency",
          currency: "USD",
        }).format(data.getValue<number>()),
    },
    {
      accessorKey: "vegan",
      header: "Vegan",
      cell: (data) => (data.getValue() ? "yes" : "no"),
    },
  ];

  const {
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    isLoading,
  } = useTableConfig();

  const queryClient = useQueryClient();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      sorting: sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <div className="visibility">
        {table.getAllLeafColumns().map((column) => (
          <div key={column.id}>
            <label
              className="visibilityToggle"
              onClick={column.getToggleVisibilityHandler()}
            >
              {typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.columnDef.id}
              {column.getIsVisible() ? <AiFillEye /> : <AiFillEyeInvisible />}
            </label>
          </div>
        ))}
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  {...(header.column.getCanSort() && {
                    className: "sortable",
                    onClick: header.column.getToggleSortingHandler(),
                  })}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <AiFillCaretUp />,
                        desc: <AiFillCaretDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="refetch"
        onClick={() => {
          queryClient.invalidateQueries();
          queryClient.refetchQueries();
        }}
      >
        Refetch config
      </button>
    </>
  );
};

export default App;
