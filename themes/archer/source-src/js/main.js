import { init } from './init';
import { toggleHeader } from './toggle-header';
import { initMobile } from './mobile';
import { sidebarInit } from './sidebar';
import { initTag } from './tag';
import Preview from './preview';

//onsole.info('hexo-theme-archer: v201701020');
init();
toggleHeader();
sidebarInit();
initTag();
initMobile();


Preview.initBigImg();
