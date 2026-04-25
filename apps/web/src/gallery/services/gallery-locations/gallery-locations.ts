import { inject, Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { Configuration } from '../../../system/services/configuration/configuration';

@Injectable({ providedIn: 'root' })
export class GalleryLocations {
  private readonly configuration = inject(Configuration);

  private readonly locations$ = this.configuration.config().pipe(map(config => config.gallery.locations));

  readonly locations = () => this.locations$;

  readonly addLocation = (location: string) =>
    this.locations$
      .pipe(
        take(1),
        map(locations => new Set(locations).add(location))
      )
      .subscribe(this.updateLocations);

  readonly removeLocation = (location: string) =>
    this.locations$
      .pipe(
        take(1),
        map(locations => {
          const set = new Set(locations);
          set.delete(location);
          return set;
        })
      )
      .subscribe(this.updateLocations);

  private readonly updateLocations = (locations: Set<string>) =>
    this.configuration.updateGalleryConfig({ locations: Array.from(locations) });
}
