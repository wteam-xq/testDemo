import React from "react";
import "./message.css";
import Notification from 'rc-notification';

let defaultDuration = 3;
let defaultTop;
let messageInstance;
let key = 1;
let prefixCls = 'ant-message';
let transitionName = 'move-up';
let getContainer;
let maxCount;

function getMessageInstance(callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance({
    prefixCls: prefixCls,
    transitionName: transitionName,
    style: {
      top: defaultTop
    },
    getContainer: getContainer,
    maxCount: maxCount
  }, (instance) => {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}

function notice(args) {
  let duration = args.duration !== undefined ? args.duration : defaultDuration;
  let iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'close-circle',
    warning: 'exclamation-circle',
    loading: 'loading'
  }[args.type];
  let target = key++;
  let closePromise = new Promise(function (resolve) {
    let callback = function callback() {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };

    getMessageInstance(function (instance) {
      let iconNode = React.createElement("span", {
        className: iconType,
      });
      instance.notice({
        key: target,
        duration: duration,
        style: {},
        content: React.createElement("div", {
          className: "".concat(prefixCls, "-custom-content").concat(args.type ? " ".concat(prefixCls, "-").concat(args.type) : '')
        }, args.icon ? args.icon : iconType ? iconNode : '', React.createElement("span", null, args.content)),
        onClose: callback
      });
    });
  });

  let result = function result() {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };

  result.then = function (filled, rejected) {
    return closePromise.then(filled, rejected);
  };

  result.promise = closePromise;
  return result;
}

let api = {
  open: notice,
  config: function config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }

    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }

    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }

    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }

    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }

    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
  },
  destroy: function destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};
['success', 'info', 'warning', 'error', 'loading'].forEach(function (type) {
  api[type] = function (content, duration, onClose) {
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return api.open({
      content: content,
      duration: duration,
      type: type,
      onClose: onClose
    });
  };
});
api.warn = api.warning;
export default api;