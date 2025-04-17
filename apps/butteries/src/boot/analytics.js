/* eslint-disable */
export default {
  logEvent(category, action, label, sessionId) {
    window.dataLayer.push({
      appEventCategory: category,
      appEventAction: action,
      appEventLabel: label,
      sessionId: sessionId,
    });
    window.dataLayer.push({ event: 'appEvent' });
  },

  logPage(path, name, sessionId) {
    window.dataLayer.push({
      screenPath: path,
      screenName: name,
      sessionId: sessionId,
    });
    window.dataLayer.push({ event: 'appScreenView' });
  },
};
