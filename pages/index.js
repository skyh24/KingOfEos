import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { siteBackgroundColor, backgroundGradient } from '../src/theme'
import { Canvas, CurrentKingdom, Explanation, HallOfFame, FAQ, Disclaimer } from '../src/components/index'
import { checkServer } from '../src/utils'
import withRedux from '../src/utils/withRedux'
import { initStore } from '../src/store'
import { fetchCurrentKingdom, fetchHallOfFame, scatterLoaded } from '../src/store/actions'
import '../theme/dist/semantic.min.css'
import '../theme/dist/themes/default/assets/fonts/icons.eot'
import '../theme/dist/themes/default/assets/fonts/icons.woff'
import '../theme/dist/themes/default/assets/fonts/icons.woff2'

class Index extends React.Component {
    static propTypes = {
        fetchCurrentKingdomAction: PropTypes.func.isRequired,
        fetchHallOfFameAction: PropTypes.func.isRequired,
        scatterLoadedAction: PropTypes.func.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        currentKingdomKings: PropTypes.array.isRequired,
        currentKingdomOrder: PropTypes.number.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        hallOfFameKings: PropTypes.array.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        canvasKings: PropTypes.array.isRequired,
    }

    componentDidMount() {
        if (!checkServer()) {
            const { fetchHallOfFameAction, fetchCurrentKingdomAction } = this.props
            fetchCurrentKingdomAction()
            fetchHallOfFameAction()
            if (window.scatter) this.onScatterLoad()
            else document.addEventListener(`scatterLoaded`, this.onScatterLoad)
        }
    }

    componentWillUnmount() {
        if (!checkServer()) {
            document.removeEventListener(`scatterLoaded`, this.onScatterLoad)
        }
    }

    onScatterLoad = () => {
        // Scatter will now be available from the window scope.
        // At this stage the connection to Scatter from the application is
        // already encrypted.
        const scatter = window.scatter
        // It is good practice to take this off the window once you have
        // a reference to it.
        window.scatter = null
        this.props.scatterLoadedAction(scatter)
    }

    render() {
        const {
            currentKingdomKings,
            currentKingdomOrder,
            hallOfFameKings,
            canvasKings,
        } = this.props
        return (
            <div className="root">
                <Canvas kings={canvasKings} />
                <CurrentKingdom kings={currentKingdomKings} kingdomOrder={currentKingdomOrder} />
                <div className="divider" />
                <Explanation />
                <div className="divider" />
                <HallOfFame kings={hallOfFameKings} />
                <div className="divider" />
                <FAQ />
                <div className="divider" />
                <Disclaimer />
                <style jsx>{`
                    .root {
                        background-color: ${siteBackgroundColor};
                        margin-bottom: 50px;
                    }

                    .divider {
                        width: 100%;
                        transform: skew(1.5deg, -1.5deg);
                        margin-bottom: 60px;
                    }

                    .divider::before {
                        content: '';
                        background-image: ${backgroundGradient};
                        height: 40px;
                        display: block;
                    }

                    * {
                        box-sizing: border-box;
                    }
                    :global(body) {
                        margin: 0;
                        padding: 0;
                    }

                    :global(.ui.dimmer.transition) {
                        display: flex !important;
                    }

                    :global(.ui.modal) {
                        margin-top: 0 !important;
                    }
                `}</style>
            </div>
        )
    }
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
    fetchCurrentKingdomAction: bindActionCreators(fetchCurrentKingdom, dispatch),
    fetchHallOfFameAction: bindActionCreators(fetchHallOfFame, dispatch),
    scatterLoadedAction: bindActionCreators(scatterLoaded, dispatch),
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
