import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator"; // type-only import
import { Message } from "primereact/message";
import axios from "axios";

// --- TYPES ---
interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  place_of_origin: string;
}

interface ApiResponse {
  data: Artwork[];
  pagination: {
    limit: number;
    total: number;
  };
}

// --- API SERVICE ---
const fetchApi = async (pageNumber: number): Promise<ApiResponse> => {
  const response = await axios.get(
    `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
  );
  return response.data;
};

// --- COMPONENT ---
export const Datatable = () => {
  const [artworksOnPage, setArtworksOnPage] = useState<Artwork[]>([]);
  const [selectionState, setSelectionState] = useState<Record<number, Artwork>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [bulkSelectCount, setBulkSelectCount] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const bulkSelectPanel = useRef<OverlayPanel>(null);
  const quantityInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get("page") || "1", 10);
    setCurrentPage(pageParam - 1);
  }, []);

  useEffect(() => {
    fetchArtworksForPage(currentPage + 1);
  }, [currentPage]);

  const fetchArtworksForPage = async (pageNumber: number) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response: ApiResponse = await fetchApi(pageNumber);
      setRowsPerPage(response.pagination.limit);
      setTotalArtworks(response.pagination.total);
      setArtworksOnPage(response.data);
    } catch (error) {
      console.error("Failed to fetch artwork data:", error);
      setFetchError("Could not load artworks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setCurrentPage(e.page);
    const url = new URL(window.location.href);
    url.searchParams.set("page", (e.page + 1).toString());
    window.history.pushState({}, "", url);
  };

  const executeBulkSelection = async (quantity: number) => {
    if (quantity <= 0) return;

    setIsLoading(true);
    setFetchError(null);
    bulkSelectPanel.current?.hide();

    try {
      let fetchedItems: Artwork[] = [];
      let pageToFetch = 1;

      while (
        fetchedItems.length < quantity &&
        (pageToFetch - 1) * rowsPerPage < totalArtworks
      ) {
        const response: ApiResponse = await fetchApi(pageToFetch);
        fetchedItems = fetchedItems.concat(response.data);
        pageToFetch++;
      }

      const targetItems = fetchedItems.slice(0, quantity);
      const isAllTargetedSelected = targetItems.every(
        (item) => selectionState[item.id]
      );

      const newSelection: Record<number, Artwork> = { ...selectionState };
      if (isAllTargetedSelected) {
        targetItems.forEach((item) => delete newSelection[item.id]);
      } else {
        targetItems.forEach((item) => (newSelection[item.id] = item));
      }
      setSelectionState(newSelection);
    } catch (error) {
      console.error("Bulk selection failed:", error);
      setFetchError("An error occurred while performing bulk selection.");
    } finally {
      setIsLoading(false);
      setBulkSelectCount("");
    }
  };

  const activePageSelection = artworksOnPage.filter(
    (artwork) => selectionState[artwork.id]
  );

  const HeaderControls = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <Checkbox
        checked={
          artworksOnPage.length > 0 &&
          activePageSelection.length === artworksOnPage.length
        }
        onChange={(e) => {
          const updatedSelection: Record<number, Artwork> = { ...selectionState };
          if (e.checked) {
            artworksOnPage.forEach(
              (artwork) => (updatedSelection[artwork.id] = artwork)
            );
          } else {
            artworksOnPage.forEach((artwork) => delete updatedSelection[artwork.id]);
          }
          setSelectionState(updatedSelection);
        }}
      />
      <Button
        type="button"
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm"
        onClick={(e) => bulkSelectPanel.current?.toggle(e)}
      />
      <OverlayPanel ref={bulkSelectPanel} showCloseIcon dismissable>
        <div style={{ padding: "1rem", width: "200px" }}>
          <input
            ref={quantityInput}
            type="number"
            value={bulkSelectCount}
            placeholder="Enter quantity"
            className="p-inputtext p-component p-inputtext-sm w-full mb-2"
            onChange={(e) => setBulkSelectCount(e.target.value)}
          />
          <Button
            label="Apply"
            style={{ margin: "20px" }}
            icon="pi pi-check"
            className="p-button-sm w-full"
            onClick={() => {
              const num = parseInt(quantityInput.current?.value || "0", 10);
              if (!isNaN(num)) executeBulkSelection(num);
            }}
          />
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="container">
      <div style={{ marginBottom: "1rem" }}>
        <p>Total Items Selected: {Object.keys(selectionState).length}</p>
      </div>

      {fetchError && (
        <Message severity="error" text={fetchError} style={{ marginBottom: "1rem" }} />
      )}

      <DataTable
        value={artworksOnPage}
        selection={activePageSelection}
        onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
          const pageSelection = e.value;
          const pageSelectionIds = new Set(pageSelection.map((item) => item.id));

          const updatedSelection: Record<number, Artwork> = { ...selectionState };
          artworksOnPage.forEach((item) => {
            if (pageSelectionIds.has(item.id)) {
              updatedSelection[item.id] = item;
            } else {
              delete updatedSelection[item.id];
            }
          });
          setSelectionState(updatedSelection);
        }}
        dataKey="id"
        selectionMode="multiple"
        paginator={false}
        tableStyle={{ minWidth: "50rem" }}
        loading={isLoading}
      >
        <Column selectionMode="multiple" header={HeaderControls} />
        <Column field="title" header="Title" body={(row) => row.title ?? "N/A"} sortable />
        <Column
          field="artist_display"
          header="Artist"
          body={(row) => row.artist_display ?? "N/A"}
          sortable
        />
        <Column
          field="place_of_origin"
          header="Origin"
          body={(row) => row.place_of_origin ?? "N/A"}
          sortable
        />
      </DataTable>

      <Paginator
        first={currentPage * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalArtworks}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </div>
  );
};
