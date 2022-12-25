import { ItemRaiting } from './raiting.entity';

export const raitingProviders = [{
    provide: "RAITING_REPOSITORY",
    useValue: ItemRaiting,
}];