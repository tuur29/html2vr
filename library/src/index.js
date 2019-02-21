
import { add3DButton } from './button';
import { render3DScene } from './frame';
import { defaultConfig } from './defaultConfig';

export function init(params = {}) {
  const config = {
    ...defaultConfig,
    ...params,
  };

  add3DButton(config);
}

export function render(params = {}) {
  const config = {
    ...defaultConfig,
    ...params,
  };

  render3DScene(config);
}
