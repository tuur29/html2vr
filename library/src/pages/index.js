import { GridPage } from './grid';
import { DetailPage } from './detail';
import { ImagePage } from './image';
import { ListPage } from './list';
import { getParentWindow } from '../helpers';

export function drawPage(type, scene, params, sceneCallback) {
  // pre defined renderers
  if (type === 'image' || ImagePage.pageIsImageFile(getParentWindow().document)) {
    const data = ImagePage.getData(getParentWindow().document);
    return ImagePage.draw(scene, data, params, sceneCallback);
  }

  if (type === 'detail') {
    const data = DetailPage.getData(getParentWindow().document);
    return DetailPage.draw(scene, data, params, sceneCallback);
  }

  if (type === 'grid') {
    const data = GridPage.getData(getParentWindow().document);
    return GridPage.draw(scene, data, params, sceneCallback);
  }

  if (type === 'list') {
    const data = ListPage.getData(getParentWindow().document);
    return ListPage.draw(scene, data, params, sceneCallback);
  }

  return false;
}
