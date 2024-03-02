import { create } from "zustand";

const defaultValues = { id:"", title:"" };

interface RenameModalState {
    open: boolean;
    setOpen: (id:string, title:string) => void;
    values: typeof defaultValues;
    setValues: () => void;
}

export const useRenameModal = create<RenameModalState>((set) => ({
    open: false,
    setOpen: (id,title) => set({ 
        open:true,
        values: { id, title },
     }),
    setValues: () => set({ open:false, values: defaultValues }),
    values: defaultValues,
}))