import type { Folder } from "../services/types";

export const FolderRow = ({ folder }: { folder: Folder }) => {
  return `
    <li hx-target="this" hx-swap="outerHTML">
        <a href="/folder/${folder.id}">${folder.name}</a>
        
        <button
            class="btn btn-danger"
            hx-get="/folder/${folder.id}/edit.json"}
        >
            Edit
        </button>
    </li>
    `;
};
