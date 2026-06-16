import { USER_ROLE, USER_STATUS } from "@/consts/user.const";

export type TJwtPayload = {
  userId: string;
  name: {
    firstName: string;
    lastName: string;
  };
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
};