import { DimensionLocation } from '@minecraft/server';

import { DimensionBlockVolume } from '../models/DimensionBlockVolume';

import DynamicPropertyUtils from './DynamicPropertyUtils';

const isInSafeArea = (location: DimensionLocation) => DynamicPropertyUtils.retrieveSafeAreas()
    .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension))
    .some((dbv) => dbv.dimension.id === location.dimension.id && dbv.isInside(location));

const SafeZoneUtils = { isInSafeArea };

export default SafeZoneUtils;
