import React, { ReactNode, useState } from "react";
import { Search, Edit, Trash2, Plus, FileText, FileSpreadsheet, ChevronLeft, ChevronRight, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface CrudPageProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onDelete?: (id: number) => void;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onSave?: (formData?: any) => void;
  formContent?: ReactNode;
  searchPlaceholder?: string;
  filterOptions?: ReactNode;
  renderActions?: (row: any, actions?: { onEdit: (row: any) => void }) => ReactNode;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  currentItem?: any;
}

export default function CrudPage({
  title,
  description,
  columns,
  data,
  onDelete,
  onAdd,
  onEdit,
  onSave,
  formContent,
  searchPlaceholder = "Buscar...",
  filterOptions,
  renderActions,
  isDialogOpen,
  onDialogOpenChange,
  currentItem,
}: CrudPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportScope, setExportScope] = useState<"all" | "page">("all");
  const itemsPerPage = 10;

  const filteredData = data.filter((item) => {
    const searchString = Object.values(item).join(" ").toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const toast = useToast().toast;

  // Helper: try to extract text from a render result (string, number, React element, array...)
  const extractText = (node: any): string => {
    if (node === null || node === undefined) return "";
    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    // React element
    if (React.isValidElement(node)) {
      // @ts-ignore access children
      return extractText(node.props?.children);
    }
    // fallback to JSON
    try {
      return JSON.stringify(node);
    } catch {
      return String(node);
    }
  };

  const getCellDisplay = (col: Column, item: any) => {
    if (col.render) {
      try {
        const rendered = col.render(item[col.key], item);
        return extractText(rendered);
      } catch (e) {
        // fallback to raw value
        return String(item[col.key] ?? "");
      }
    }
    const v = item[col.key];
    return v === null || v === undefined ? "" : String(v);
  };

  // PDF export using jsPDF + autotable (use autoTable function import)
  const exportToPDF = (scope: "all" | "page" = "all") => {
    try {
      const source = scope === "all" ? filteredData : paginatedData;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const headers = columns.map(col => col.label);
      const rows = source.map(item => columns.map(col => getCellDisplay(col, item)));

      // ---- Header / metadata ----
      const companyName = "Nails Nice";
      const now = new Date();
      const dateStr = now.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
      const isoDate = now.toISOString().slice(0, 10);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Company name (left) and date (right) in the header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80); // dark blue
      doc.text(companyName, 40, 40);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha: ${dateStr}`, pageWidth - 40, 40, { align: "right" });

      // Report title centered below
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.text(title.toUpperCase(), pageWidth / 2, 64, { align: "center" });

      // Small description or subtitle if you want (optional)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Reporte generado el ${dateStr} · ${source.length} registros`, pageWidth / 2, 78, { align: "center" });

      const startY = 90;

      // autoTable with improved styles
      autoTable(doc as any, {
        startY,
        head: [headers],
        body: rows,
        margin: { left: 40, right: 40 },
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 6,
          textColor: 50,
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255,
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 246, 248],
        },
        tableLineColor: [220, 220, 220],
        tableLineWidth: 0.5,
        theme: "striped",
        didDrawPage: (data: any) => {
          // Footer: page number and company name
          const pageNumber = data.pageNumber;
          // Types for jsPDF in your environment might not include getNumberOfPages.
          // Use a safe cast to any to avoid the TS error while keeping runtime behavior.
          const totalPages = typeof (doc as any).getNumberOfPages === "function"
            ? (doc as any).getNumberOfPages()
            : // fallback to 1 if method doesn't exist on the typed object
              1;
          doc.setFontSize(9);
          doc.setTextColor(120);
          doc.text(`${companyName} · ${title}`, 40, pageHeight - 30);
          doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 40, pageHeight - 30, { align: "right" });
        },
      });

      const fileName = `${title.toLowerCase().replace(/ /g, "_")}_${companyName.toLowerCase().replace(/ /g, "_")}_${isoDate}.pdf`;
      doc.save(fileName);

      toast({ title: "Exportado a PDF", description: `${fileName} generado correctamente.`, duration: 3000 });
      setShowExportDialog(false);
    } catch (err) {
      console.error("Error exportando PDF", err);
      toast({ title: "Error", description: "No se pudo generar el PDF.", variant: "destructive" });
    }
  };

  // Excel/CSV export
  const exportFile = async (format: "csv" | "xlsx", scope: "all" | "page" = "all") => {
    const source = scope === "all" ? filteredData : paginatedData;
    const headers = columns.map(col => col.label);
    const rows = source.map(item => columns.map(col => getCellDisplay(col, item)));

    try {
      if (format === "csv") {
        const csvContent = [headers, ...rows].map(r => r.map(cell => {
          const s = String(cell ?? "");
          if (s.includes(",") || s.includes('"') || s.includes("\n")) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        }).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${title.toLowerCase().replace(/ /g, "_")}.csv`);
        toast({ title: "CSV generado", description: "Descarga iniciada.", duration: 3000 });
      } else {
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, `${title.toLowerCase().replace(/ /g, "_")}.xlsx`);
        toast({ title: "Excel generado", description: "Descarga iniciada.", duration: 3000 });
      }
      setShowExportDialog(false);
    } catch (err) {
      console.error("Error exportando Excel/CSV", err);
      toast({ title: "Error", description: "No se pudo generar el archivo.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-l-4 border-foreground pl-4">
          <h1 className="text-5xl font-black tracking-tight text-foreground">{title.toUpperCase()}</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">{description}</p>
        </div>

        <Card className="shadow-elegant border-2">
          <CardContent className="p-6">
            {/* Botón Agregar arriba de la tabla */}
            <div className="flex justify-end items-center mb-6">
              <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button onClick={() => onAdd?.()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar {title}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{currentItem ? `Editar ${title}` : `Nuevo ${title}`}</DialogTitle>
                  </DialogHeader>
                  {formContent}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => onDialogOpenChange(false)}>Cancelar</Button>
                    <Button onClick={() => {
                      onSave?.();
                      onDialogOpenChange(false);
                    }}>
                      {currentItem ? "Actualizar" : "Agregar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-muted border-border h-12"
                />
              </div>

              {filterOptions}

              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToPDF("all")}
                  className="flex items-center gap-2 bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-sm transition-colors px-3 py-2 rounded-md"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold text-sm">PDF</span>
                </Button>

                {/* Excel: opens a friendly dialog so user can pick CSV/XLSX and scope */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportDialog(true)}
                  className="flex items-center gap-2 bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm transition-colors px-3 py-2 rounded-md"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="font-semibold text-sm">EXPORTAR</span>
                </Button>

                {/* Export dialog (styled & user-friendly) */}
                <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <File className="h-5 w-5 text-primary" />
                        Exportar {title}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      <p className="text-sm text-muted-foreground">
                        Elige el formato y el alcance de los datos que deseas descargar.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {/* CSV button: stronger colors, visible text and icon, full width */}
                        <Button
                          onClick={() => exportFile("csv", exportScope)}
                          className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow-md border border-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-colors rounded-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h10" />
                          </svg>
                          <span className="text-sm">Descargar CSV</span>
                        </Button>

                        {/* XLSX button: green gradient, visible text and icon */}
                        <Button
                          onClick={() => exportFile("xlsx", exportScope)}
                          className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md border border-green-600 hover:from-green-600 hover:to-green-700 transition-colors rounded-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h18v18H3z" opacity="0.15" />
                            <path d="M8 12h8v2H8zM8 16h8v2H8zM8 8h8v2H8z" />
                          </svg>
                          <span className="text-sm">Descargar Excel</span>
                        </Button>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-medium mb-2">Alcance</label>
                        <div className="flex gap-3 items-center">
                          <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${exportScope === "all" ? "bg-muted/30" : "bg-transparent"}`}>
                            <input type="radio" name="scope" checked={exportScope === "all"} onChange={() => setExportScope("all")} />
                            <span className="text-sm">Todos los resultados ({filteredData.length})</span>
                          </label>
                          <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${exportScope === "page" ? "bg-muted/30" : "bg-transparent"}`}>
                            <input type="radio" name="scope" checked={exportScope === "page"} onChange={() => setExportScope("page")} />
                            <span className="text-sm">Página actual ({paginatedData.length})</span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancelar</Button>
                        <Button onClick={() => {
                          // default: export xlsx for quick action
                          exportFile("xlsx", exportScope);
                        }} className="flex items-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm transition-colors px-3 py-2 rounded-md">
                          <FileSpreadsheet className="h-4 w-4" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableHead key={column.key} className="font-bold">{column.label}</TableHead>
                    ))}
                    <TableHead className="text-right font-bold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-accent/50 hover:-translate-y-1 hover:shadow-medium transition-all duration-300 cursor-pointer"
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        {renderActions ? renderActions(row, { onEdit }) : (
                          <div className="flex justify-end gap-2">
                            <div className="group/edit relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit?.(row)}
                                className="hover:bg-blue-500/10 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Editar
                              </span>
                            </div>
                            <div className="group/delete relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDeletingItem(row);
                                  setShowConfirmDelete(true);
                                }}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Eliminar
                              </span>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de{" "}
                {filteredData.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 ${currentPage !== page ? "bg-muted" : ""}`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-muted"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            {deletingItem && (
              <div className="py-4">
                <p className="text-foreground mb-4">¿Estás seguro de que deseas eliminar este registro?</p>
                <div className="bg-accent/30 p-4 rounded-lg space-y-2">
                  {columns.slice(0, 3).map((column) => (
                    <p key={column.key} className="text-sm">
                      <span className="font-medium">{column.label}:</span>{" "}
                      <span className="text-muted-foreground">
                        {column.render 
                          ? typeof column.render(deletingItem[column.key], deletingItem) === 'string'
                            ? column.render(deletingItem[column.key], deletingItem)
                            : deletingItem[column.key]
                          : deletingItem[column.key]
                        }
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete?.(deletingItem?.id);
                  toast({ title: "Eliminado", description: "Registro eliminado correctamente.", duration: 3000 });
                  setShowConfirmDelete(false);
                  setDeletingItem(null);
                }}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}