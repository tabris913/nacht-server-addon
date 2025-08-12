# To learn more about how to use Nix to configure your environment
# see: https:#developers.google.com/idx/guides/customize-idx-env
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-25.05"; # or "unstable"
  # Use https:#search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_24
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
    pkgs.apt
    pkgs.getopt
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https:#open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "AkankshaSingh872.case-change" # Case Change
      "mhutchie.git-graph" # Git Graph
      "donjayamanne.githistory" # Git History
      "ryu1kn.partial-diff" # Partial Diff
      "esbenp.prettier-vscode" # Prettier
      "chrmarti.regex" # Regax Previewer
      "humao.rest-client" # REST Client
      "emeraldwalk.runonsave" # Run on Save
      "Gruntfuggly.todo-tree" # Todo Tree
      "yzhang.markdown-all-in-one" # Markdown All in One
      "yzane.markdown-pdf" # Markdown PDF
      "shd101wyy.markdown-preview-enhanced" # Markdown Preview Enhanced
      "alanwalk.markdown-toc" # Markdown TOC
      "mechatroner.rainbow-csv" # Rainbow CSV
      "richie5um2.vscode-sort-json" # Sort JSON objects
      "arjun.swagger-viewer" # Swagger Viewer
      "dotjoshjohnson.xml" # XML Tools
      "redhat.vscode-yaml" # YAML
      "mojang-studios.minecraft-debugger" #
      # typescript
      "salbert.comment-ts" # Comments in Typescript
      "dbaeumer.vscode-eslint" # ESLint
      "csstools.postcss" # PostCSS Language Support
      "stylelint.vscode-stylelint" # Stylelint
      "bradlc.vscode-tailwindcss" # Tailwind CSS IntelliSense
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          # Cover all the variations of language, src-dir, router (app/pages)
        ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = false;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
