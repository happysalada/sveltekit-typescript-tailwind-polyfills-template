{ pkgs }:
let
  common_attributes = {
    version = "0.0.1";
    src = ./../..;
    # nodejs = nodejs_latest;
    npmDepsHash = "";
    makeCacheWritable = true;
    env.PUBLIC_ENVIRONMENT = "production";

    # needed for sharp
    buildInputs = with pkgs; [ vips ];
    nativeBuildInputs =  with pkgs; (lib.optionals stdenv.isLinux [
      pkg-config nodePackages.node-gyp nodePackages.semver python3
    ]);
  };
  REPLACE_ME = with pkgs; buildNpmPackage (common_attributes // {
    pname = "REPLACE_ME";
  }) ;
in
{
  inherit REPLACE_ME;
}
