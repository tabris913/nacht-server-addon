import hurt from './hurt';
import interactWithBlock from './interactWithBlock';
import interactWithEntity from './interactWithEntity';
import remove from './remove';

export default () => {
  hurt();
  interactWithBlock();
  interactWithEntity();
  remove();
};
