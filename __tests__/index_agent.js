const {
    createEvent,
    createIdentify,
    createPageview,
    createCache,
    getMeta,
    resetMeta,
    clone,
} = require('posthog-plugins/test/utils.js')
const { setupPlugin, processEvent } = require('../index')

const netdataPluginVersion = '0.0.1'

beforeEach(() => {
    resetMeta({
        config: {
            netdata_version: 'v1.29.2',
        },
    })
})

test('setupPlugin', async () => {
    expect(getMeta().config.netdata_version).toEqual('v1.29.2')
    await setupPlugin(getMeta())
    expect(getMeta().global.setupDone).toEqual(true)
})

// test has_alarms_critical
test('has_alarms_critical', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "alarms_critical": 1 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_critical: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test has_alarms_warning
test('has_alarms_warning', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "alarms_warning": 0 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_warning: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test netdata_buildinfo
test('netdata_buildinfo', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "netdata_buildinfo": "JSON-C|dbengine|Native HTTPS|LWS v3.2.2" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            netdata_buildinfo_json_c: true,
            netdata_buildinfo_dbengine: true,
            netdata_buildinfo_native_https: true,
            netdata_buildinfo_lws_v3_2_2: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test host_collectors
test('host_collectors', async () => {
    const event = createEvent({
        event: 'test event',
        properties: {
            "$current_url":"agent backend",
            "host_collectors": [
                {
                    "plugin": "python.d.plugin",
                    "module": "dockerhub"
                },
                {
                    "plugin": "apps.plugin",
                    "module": ""
                },
                {
                    "plugin": "proc.plugin",
                    "module": "/proc/diskstats"
                },
                {
                    "plugin": "proc.plugin",
                    "module": "/proc/softirqs"
                },
            ]
        }
    })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            host_collector_plugin_python_d_plugin: true,
            host_collector_plugin_apps_plugin: true,
            host_collector_plugin_proc_plugin: true,
            host_collector_module_dockerhub: true,
            host_collector_module_proc_diskstats: true,
            host_collector_module_proc_softirqs: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test host_collectors null
test('host_collectors_null', async () => {
    const event = createEvent({
        event: 'test event',
        properties: {
            "$current_url":"agent backend",
            "host_collectors": [null]
        }
    })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test netdata_machine_guid
test('netdata_machine_guid', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "netdata_machine_guid": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            "$current_url":"agent backend",
            netdata_machine_guid: 'empty',
            netdata_machine_guid_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test netdata_machine_guid
test('netdata_machine_guid', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "netdata_machine_guid": "123" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            "$current_url":"agent backend",
            netdata_machine_guid: '123',
            netdata_machine_guid_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test netdata_person_id
test('netdata_person_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "netdata_person_id": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            "$current_url":"agent backend",
            netdata_person_id: 'empty',
            netdata_person_id_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test netdata_person_id
test('netdata_person_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "netdata_person_id": "123" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            "$current_url":"agent backend",
            netdata_person_id: '123',
            netdata_person_id_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test distinct_id
test('distinct_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "$current_url":"agent backend", "distinct_id": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            distinct_id: 'empty',
            $current_url: 'agent backend',
            distinct_id_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

// test distinct_id
test('distinct_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "distinct_id": "123", "$current_url": "agent backend" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            distinct_id: '123',
            $current_url: 'agent backend',
            distinct_id_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})


// test data_testid
test('data_testid', async () => {
    const eventExample = {
        "event": "$autocapture",
        "distinct_id": "dev-test",
        "$current_url": "agent backend",
        "properties": {
            "$current_url": "agent backend",
            "$elements": [
                {
                    "attr__data-testid": "date-picker::click-quick-selector::::21600",
                },
                {
                    "attr__href": "#menu_web_log_nginx"
                },
                {
                    "event": null,
                    "text": null,
                    "tag_name": "div",
                    "attr_class": [
                        "bjKBDB",
                        "styled__ShortPick-sc-1yj3701-6"
                    ],
                    "href": null,
                    "attr_id": null,
                    "nth_child": 1,
                    "nth_of_type": 1,
                    "attributes": {
                        "attr__class": "styled__ShortPick-sc-1yj3701-6 bjKBDB"
                    },
                    "order": 1
                },
                {
                    "event": null,
                    "text": "unshared",
                    "tag_name": "span",
                    "attr_class": [
                        "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9",
                        "iMmOhf"
                    ],
                    "href": null,
                    "attr_id": null,
                    "nth_child": 2,
                    "nth_of_type": 1,
                    "attributes": {
                        "attr__class": "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9 iMmOhf"
                    },
                    "order": 0
                },
                {
                    "$el_text": "unshared"
                },
                {
                    "event": null,
                    "text": "unshared",
                    "tag_name": "span",
                    "attr_class": [
                        "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9",
                        "iMmOhf"
                    ],
                    "href": null,
                    "attr_id": null,
                    "nth_child": 2,
                    "nth_of_type": 1,
                    "attributes": {
                        "attr__class": "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9 iMmOhf"
                    },
                    "order": 0

                },
                {
                    "attr__data-id": "newyork_netdata_rocks_mem_ksm",
                    "attr__data-legend-position": "bottom",
                    "attr__data-netdata": "mem.ksm",
                }
            ]
        }
    }
    const event = createEvent(eventExample)
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy['properties']['el_data_testid']).toEqual("date-picker::click-quick-selector::::21600")
    expect(eventCopy['properties']['el_href_menu']).toEqual("#menu_web_log_nginx")
    expect(eventCopy['properties']['el_text']).toEqual("unshared")
    expect(eventCopy['properties']['el_data_netdata']).toEqual("mem.ksm")
    expect(eventCopy['properties']['interaction_type']).toEqual("menu")
})

// test menu
test('menu', async () => {
    const event = createEvent({ event: 'test event', properties: {"$current_url": "agent backend", "$elements":[{"attr__href": "#menu_system_submenu_cpu"}]} })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            el_href: '#menu_system_submenu_cpu',
            el_href_menu: '#menu_system_submenu_cpu',
            el_menu: 'system',
            el_submenu: 'cpu',
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'submenu',
            interaction_detail: '#menu_system_submenu_cpu',
            interaction_token: 'submenu|#menu_system_submenu_cpu',
            event_ph: 'test event',
        },
    })
})

test('processEvent does not crash with identify', async () => {
    // create a random event
    const event0 = createIdentify()

    // must clone the event since `processEvent` will mutate it otherwise
    const event1 = await processEvent(clone(event0), getMeta())
    expect(event1).toEqual(event0)
})

// test config_https_available
test('config_https_available', async () => {
    const event = createEvent({ event: 'test event', properties: { "config_https_available": "||web", "$current_url": "agent backend" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            config_https_available_web: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
        },
    })
})

