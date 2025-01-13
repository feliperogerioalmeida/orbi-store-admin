"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";

interface ConditionProps {
  id: string;
  conditionType: string;
  costPrice: number;
  sellingPrice: number;
  maxUpgradePrice: number;
}

interface CapacityProps {
  id: string;
  size: string;
  conditions: ConditionProps[];
}

interface iPhoneProps {
  id: string;
  model: string;
  capacities: CapacityProps[];
}

const DataTable = ({ iphones }: { iphones: iPhoneProps[] }) => {
  const { toast } = useToast();

  const [data, setData] = useState(
    iphones.flatMap((iphone) =>
      iphone.capacities.flatMap((capacity) =>
        capacity.conditions.map((condition) => ({
          id: condition.id,
          model: iphone.model,
          capacity: capacity.size,
          conditionType: condition.conditionType,
          costPrice: condition.costPrice.toFixed(2),
          sellingPrice: condition.sellingPrice.toFixed(2),
          maxUpgradePrice: condition.maxUpgradePrice.toFixed(2),
        })),
      ),
    ),
  );

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    costPrice?: string;
    sellingPrice?: string;
    maxUpgradePrice?: string;
  } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleEditClick = (row: {
    id: string;
    costPrice: string;
    sellingPrice: string;
    maxUpgradePrice: string;
  }) => {
    setEditingRowId(row.id);
    setEditedValues({
      costPrice: row.costPrice,
      sellingPrice: row.sellingPrice,
      maxUpgradePrice: row.maxUpgradePrice,
    });
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedValues(null);
    setFocusedField(null);
  };

  const handleSaveClick = async () => {
    if (editingRowId && editedValues) {
      try {
        const response = await fetch(
          `/api/iphones/conditions/${editingRowId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              costPrice: parseFloat(editedValues.costPrice || "0"),
              sellingPrice: parseFloat(editedValues.sellingPrice || "0"),
              maxUpgradePrice: parseFloat(editedValues.maxUpgradePrice || "0"),
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Erro ao salvar no banco de dados.");
        }

        const updatedCondition = await response.json();

        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingRowId
              ? {
                  ...item,
                  costPrice: updatedCondition.costPrice.toFixed(2),
                  sellingPrice: updatedCondition.sellingPrice.toFixed(2),
                  maxUpgradePrice: updatedCondition.maxUpgradePrice.toFixed(2),
                }
              : item,
          ),
        );

        setEditingRowId(null);
        setEditedValues(null);
        setFocusedField(null);

        toast({
          description: "Dados salvos com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar os dados",
          description:
            "Não foi possível salvar os dados. Por favor, tente novamente.",
        });
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setEditedValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const columns: ColumnDef<{
    id: string;
    model: string;
    capacity: string;
    conditionType: string;
    costPrice: string;
    sellingPrice: string;
    maxUpgradePrice: string;
  }>[] = [
    { accessorKey: "model", header: "Modelo" },
    { accessorKey: "capacity", header: "Capacidade" },
    { accessorKey: "conditionType", header: "Condição" },
    {
      accessorKey: "costPrice",
      header: "Preço de Custo",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.costPrice || ""}
            onChange={(e) => handleInputChange(e, "costPrice")}
            onFocus={() => setFocusedField("costPrice")}
            autoFocus={focusedField === "costPrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.costPrice}`
        ),
    },
    {
      accessorKey: "sellingPrice",
      header: "Preço de Venda",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.sellingPrice || ""}
            onChange={(e) => handleInputChange(e, "sellingPrice")}
            onFocus={() => setFocusedField("sellingPrice")}
            autoFocus={focusedField === "sellingPrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.sellingPrice}`
        ),
    },
    {
      accessorKey: "maxUpgradePrice",
      header: "Preço Máximo de Upgrade",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.maxUpgradePrice || ""}
            onChange={(e) => handleInputChange(e, "maxUpgradePrice")}
            onFocus={() => setFocusedField("maxUpgradePrice")}
            autoFocus={focusedField === "maxUpgradePrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.maxUpgradePrice}`
        ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveClick}>
              Salvar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancelClick}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditClick(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-left text-nowrap text-sm"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-sm text-nowrap text-left"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center py-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
