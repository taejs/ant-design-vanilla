import * as motion from '../antd-motion';

if('antd' in window) throw Error('antd module is already defined');

let antd = {};
antd['AntdWaveShadow'] = motion.AntdWaveShadow;
antd = Object.freeze(antd);

Object.defineProperty(window, 'antd', {
  value : antd,
});