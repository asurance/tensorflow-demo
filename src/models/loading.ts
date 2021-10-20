import { action, makeObservable, observable, runInAction } from 'mobx';

export default class LoadingModel<LoadResult> {
  constructor(loadFn: () => Promise<LoadResult>) {
    makeObservable(this, {
      loaded: observable,
      loadResult: observable,
      load: action,
    });
    this.loadFn = loadFn;
  }
  private loadFn: (() => Promise<LoadResult>) | null;
  loaded = false;
  loadResult: LoadResult | null = null;
  private loadingPromise: Promise<LoadResult> | undefined;
  async load(): Promise<LoadResult> {
    if (this.loaded) {
      return this.loadResult!;
    } else {
      if (!this.loadingPromise) {
        runInAction(() => {
          this.loadingPromise = this.loadFn!().then((result) => {
            runInAction(() => {
              this.loaded = true;
              this.loadFn = null;
              this.loadResult = result;
              this.loadingPromise = undefined;
            });
            return result;
          });
        });
      }
      return await this.loadingPromise!;
    }
  }
}
