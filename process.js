import { processElementsAgent } from './process_elements_agent';
import { processPropertiesAgent } from './process_properties_agent';
import { processElementsCloud } from './process_elements_cloud';

async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    if (event.properties) {

        event.properties['event_ph'] = event.event

        if ('$current_url' in event.properties){

            if (['agent dashboard', 'agent backend'].includes(event.properties['$current_url'])) {
                event = processElementsAgent(event)
                event = processPropertiesAgent(event)
            } else if (event.properties['$current_url'].startsWith('https://app.netdata.cloud') ) {
                event.properties['event_source'] = 'cloud'
                event = processElementsCloud(event)
            } else if (event.properties['$current_url'].startsWith('https://www.netdata.cloud') ) {
                event.properties['event_source'] = 'website'
            } else if (event.properties['$current_url'].startsWith('https://learn.netdata.cloud') ) {
                event.properties['event_source'] = 'learn'
            } else if (event.properties['$current_url'].startsWith('https://community.netdata.cloud') ) {
                event.properties['event_source'] = 'community'
            } else {
                event.properties['event_source'] = 'unknown'
            }

        } else {
            event.properties['event_source'] = 'unknown'
        }

    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
