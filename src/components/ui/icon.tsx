import { Icon as IconifyIcon, type IconProps as IconifyIconProps } from "@iconify/react";

export interface IconProps extends Omit<IconifyIconProps, "icon"> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  return <IconifyIcon icon={name} {...props} />;
}
