import die from './die';
import hurt from './hurt';
import interactWithBlock from './interactWithBlock';
import interactWithEntity from './interactWithEntity';
export default () => {
    hurt();
    interactWithBlock();
    interactWithEntity();
    die();
};
