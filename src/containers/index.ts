export default {
    editer: () => import('./editer').then(x => x.default),
    test: () => import('./test').then(x => x.default)
}