import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";

export const persister = createAsyncStoragePersister({
  storage: { getItem: get, setItem: set, removeItem: del },
});
