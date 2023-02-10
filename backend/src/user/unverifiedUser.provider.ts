import { Unverified } from './unverifiedUser.entity';

export const unverifiedUserProviders = [{
    provide: "UNVERIFIED_REPOSITORY",
    useValue: Unverified,
}];