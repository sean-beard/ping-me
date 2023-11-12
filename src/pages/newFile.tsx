import FileList from "@/components/FileList.astro";
import FolderList from "@/components/FolderList.astro";
import Layout from "@/layouts/Layout.astro";
import { userIsAuthenticated, folders, files } from "./index.astro";

<Fragment>
<Layout title="Home | PingMe">
{!userIsAuthenticated && (
<Fragment><div>
<h2>Sign up</h2>

<form method="POST" {...{ "hx-post": "/sign-up.json", "hx-target": "this", "hx-swap": "outerHTML" }}>
<label for="username">Username</label>
<input type="text" name="username" id="username" />

<label for="password">Password</label>
<input type="password" name="password" id="password" />

<button type="submit">Sign up</button>
</form>

<h2>Login</h2>

<form method="POST" {...{ "hx-post": "/login.json", "hx-target": "this", "hx-swap": "outerHTML" }}>
<label for="username">Username</label>
<input type="text" name="username" id="username" />

<label for="password">Password</label>
<input type="password" name="password" id="password" />

<button type="submit">Login</button>
</form>
</div></Fragment>
)}

{userIsAuthenticated && folders && (
<Fragment><section>
<div style="display: flex; align-items: center; gap: 0.5rem;">
<h2>Folders</h2>

<div {...{ "hx-target": "this", "hx-swap": "outerHTML" }}>
<button title="Add folder" {...{ "hx-get": "/create-folder" }}>
<span>➕</span>
</button>
</div>
</div>

<FolderList folders={folders} />
</section></Fragment>
)}

{userIsAuthenticated && (
<Fragment><section>
<h2>Files</h2>

<a href="/file/new">Create File</a>

{files && <Fragment><FileList files={files} /></Fragment>}
</section></Fragment>
)}
</Layout>

<style>{`
  main {
    padding: 1.5rem;
  }

  section {
    background-color: var(--section-background);
    border-radius: 0.5rem;
    padding: 1.5rem;
    padding-top: 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow);
  }

  section h2 {
    color: var(--black);
  }

  li {
    margin-bottom: 1rem;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  button span {
    font-size: 2rem;
  }
`}</style>

</Fragment>;
