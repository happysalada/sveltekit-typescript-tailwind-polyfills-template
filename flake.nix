{
  description = "Just a shell for now";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    devshell.url = "github:numtide/devshell";
    devshell.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { nixpkgs, flake-utils, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ devshell.overlays.default ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        packages = with pkgs; [
          nodejs_latest
          nodePackages_latest.dotenv-cli
          npm-check-updates

          # db
          surrealdb-migrations
        ];
      in
      {
        devShell = pkgs.devshell.mkShell {
          inherit packages;
          env = [
            {
              name = "PUBLIC_ENVIRONMENT";
              value = "development";
            }
          ];
          commands = [
            {
              name = "clean";
              category = "dev";
              help = "Clean the package manager directory and local direnv";
              command = ''
                direnv prune
              '';
            }
            {
              name = "dev";
              category = "dev";
              help = "Start dev server locally";
              command = "npm run dev";
            }
            {
              name = "deps_update";
              category = "dev";
              help = "update dependencies";
              command = "ncu -ui";
            }
            {
              name = "build";
              category = "dev";
              help = "build the project for release";
              command = "npm run build";
            }
            {
              name = "preview";
              category = "dev";
              help = "preview the release build";
              command = "npm run preview";
            }
          ];
        };
      }
    );
}
