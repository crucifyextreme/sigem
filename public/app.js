angular.module('appSac', ['ngRoute', 'ngResource','appLogin','ui.mask','ngCookies','currencyMask']);
angular.module('appVistoria', ['ngRoute', 'ngResource','appLogin','ui.mask','ngCookies']);
angular.module('appRecisao', ['ngAnimate', 'ngRoute', 'ngResource','appLogin','ui.mask','ngCookies']);

angular.module('MainApp',
    [
        'appSac',
        'appLogin',
        'appVistoria',
        'appRecisao'
    ]
);
