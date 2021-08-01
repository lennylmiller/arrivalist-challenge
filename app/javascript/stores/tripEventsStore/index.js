import Analyzer from './Analyzer'

class TripEventsStore {

  _analyzer

  constructor() {
    this._analyzer = new Analyzer()
  }

  getAnalyzer = () => {
    return this._analyzer
  }
}

export default new TripEventsStore()
