export interface ObjectWithSetupTime {
  setupTime: Date;
}

interface UserInformation {
  firstName: string;
  telegramId: string;
  photoUrl: string;
  username: string;
}

export interface AuthState extends ObjectWithSetupTime {
  token: string;
  orgIds: Array<number>;
  userInfo: UserInformation | null;
  userId: number;
  permissions: {
    isAdmin: boolean;
    isAcadsAdmin: boolean;
    venueIdToIsVenueAdmin: Record<number, boolean>;
  };
}
