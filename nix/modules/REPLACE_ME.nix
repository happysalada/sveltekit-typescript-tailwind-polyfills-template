{ config, pkgs, lib, ... }:
let
  cfg = config.services.REPLACE_ME;
in
{
  options.services.REPLACE_ME = {
    enable = lib.mkEnableOption (lib.mdDoc "REPLACE_ME service");

    port = lib.mkOption {
      type = lib.types.port;
      default = 3001;
      description = lib.mdDoc "Port the REPLACE_ME server listens on.";
    };

    environmentFile = lib.mkOption {
      type = lib.types.path;
      description = lib.mdDoc ''
        Path to the file containing environment secrets needed to run the service.
      '';
      default = "";
      example = "config.age.secrets.ENVIRONMENT_FILE.path";
    };

    # logLevel = lib.mkOption {
    #   type = lib.types.enum [ "error" "warn" "info" "debug" "trace" ];
    #   default = "info";
    #   description = lib.mdDoc "Log level";
    # };
  };

  config = lib.mkIf cfg.enable {

   systemd.services.REPLACE_ME = {
      description = "REPLACE_ME server";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        DynamicUser = true;
        User = "brocop";
        ExecStart = "${pkgs.nodejs}/bin/node --trace-deprecation ${pkgs.REPLACE_ME}/lib/node_modules/null/build";

        Restart = "always";
        EnvironmentFile = cfg.environmentFile;

        # hardening
        AmbientCapabilities = "";
        CapabilityBoundingSet = "";
        LockPersonality = true;
        NoNewPrivileges = true;
        PrivateDevices = true;
        PrivateMounts = true;
        PrivateTmp = true;
        PrivateUsers = true;
        ProcSubset = "pid";
        ProtectClock = true;
        ProtectControlGroups = true;
        ProtectHome = true;
        ProtectHostname = true;
        ProtectKernelLogs = true;
        ProtectKernelModules = true;
        ProtectKernelTunables = true;
        ProtectProc = "invisible";
        ProtectSystem = "strict";
        RemoveIPC = true;
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          # Required for connecting to database sockets,
          # and listening to unix socket at `cfg.settings.path`
          "AF_UNIX"
        ];
        RestrictNamespaces = true;
        RestrictRealtime = true;
        RestrictSUIDSGID = true;
        SocketBindAllow = cfg.port;
        SocketBindDeny = "any";
        SystemCallArchitectures = "native";
        SystemCallFilter = [
          "@system-service"
          "~@privileged @obsolete"
          "@pkey"
        ];
      };

      environment = {
        PORT = builtins.toString cfg.port;
        HOST = "127.0.0.1";
        PROTOCOL_HEADER = "x-forwarded-proto";
        HOST_HEADER = "x-forwarded-host";
        ADDRESS_HEADER = "X-Forwarded-For";
        XFF_DEPTH = "1";
      };
    };
  };
}
