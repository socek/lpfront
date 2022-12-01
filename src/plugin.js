export default class Plugin {
  name = null
  init(application) {
    this.application = application
  }

  async onExit() {

  }

  getAvalibleKnobs() {return {}}
  getAvalibleKeys() {return {}}

}
