declare module "react-toggle-dark-mode" {
    import * as React from "react";
  
    type AnimationProperties = {
      dark?: {
        circle?: Record<string, unknown>;
        mask?: Record<string, unknown>;
        svg?: Record<string, unknown>;
        lines?: Record<string, unknown>;
      };
      light?: {
        circle?: Record<string, unknown>;
        mask?: Record<string, unknown>;
        svg?: Record<string, unknown>;
        lines?: Record<string, unknown>;
      };
      springConfig?: Record<string, unknown>;
    };
  
    export type DarkModeSwitchProps =
      Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
        checked: boolean;
        onChange: (checked: boolean) => void;
        size?: number | string;
        moonColor?: string;
        sunColor?: string;
        animationProperties?: AnimationProperties;
      };
  
    export const DarkModeSwitch: React.FC<DarkModeSwitchProps>;
  }