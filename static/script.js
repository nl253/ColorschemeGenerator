class ColorschemeGenerator {

  /**
   * Make a new ColorschemeGenerator.
   *
   * You can choose scheme from:
   *
   * - "triadic",
   * - "tetradic",
   * - "analogous",
   * - "complementary",
   * - "split-complementary"
   *
   * Default scheme is "triadic".
   *
   * Starting hue can be specified but will be generated randomly if it is not.
   *
   * @param {string} scheme
   * @param {number} startHue
   */
  constructor(scheme = 'triadic', startHue = Math.max(10, Math.floor(Math.random() * 360))) {
    this.scheme = scheme;

    this.hue = this.startHue = startHue;
    this.lightness = Math.max(30, Math.floor(Math.random() * 80));
    this.saturation = Math.max(30, Math.floor(Math.random() * 80));

    this.lastStep = 0;
    this.sameSteps = 0;
  }

  /**
   * Generate next colour.
   *
   * @returns {string} hsl(x, y, z) string
   */
  next() {
    let hue = this.hue;
    let saturation = this.saturation;
    let lightness = this.lightness;
    this._alterHue();
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Modify internal state to produce a different colour next time.
   *
   * @private
   */
  _alterHue() {
    const newHue = this._nextHue();
    const stepSize = Math.abs(newHue - this.hue);
    if (this.lastStep === stepSize) this.sameSteps++;
    else this.sameSteps = 0;
    this.lastStep = stepSize;
    this.hue = newHue;
  }

  /**
   * Modify internal state to produce a different colour next time.
   *
   * @private
   */
  _nextHue() {
    switch (this.scheme) {
      case 'triadic':
        return (this.hue + 120) % 360;
      case 'analogous':
        return (this.hue + 30) % (this.startHue + 90);
      case 'complementary':
        return (this.hue + 180) % 360;
      case 'split-complementary': {
        if (this.lastStep === 60) {
          return (this.hue + 150) % 360;
        } else if (this.sameSteps > 0) {
          return (this.hue + 60) % 360;
        } else return (this.hue + 150) % 360;
      }
      case 'tetradic':
        return (this.hue + (this.lastStep === 60) ? 120 : 60) % 360;
    }
  }
}

/**
 * Generate preview in index.html.
 */
function main() {

  document.querySelector('body').outerHTML += `
    <h1 class="title has-text-weight-bold is-capitalized has-text-centered">
      Color Scheme Generation
    </h1>`;

  document.querySelector('body').innerHTML += ["triadic", "tetradic", "analogous", "complementary", "split-complementary"].map(scheme => {

    const generator = new ColorschemeGenerator(scheme);

    let result = `
      <section class="scheme-section flex-column">
        <h2 style="padding-bottom: 20px;" 
            class="heading is-size-3 is-capitalized has-text-weight-semibold">
          ${scheme}
        </h2>
        <div class="flex-row">`;

    for (let i = 0; i < (scheme === 'tetradic' ? 4 : scheme === 'complementary' ? 2 : 3); i++) {

      const color = generator.next();

      result += `
         <div style="padding: 50px 80px; background: ${color};">`;

       result += `
           <div class="has-background-white has-shadow is-bold has-text-black has-text-centered is-centered" 
                style="padding: 10px 30px;">
             ${color}
           </div>
         </div>`;
      }

    result += `
       </div>
     </section>
     <br>`;

      return result;
  }).join('\n\n');
}

main();