# Portfolio analytics

The site supports two optional analytics layers:

- Umami for permanent privacy-first traffic and event analytics.
- Microsoft Clarity for temporary heatmaps and session recordings.

No analytics script is loaded unless its env variable is present.

## Umami

Recommended for the always-on layer.

1. Create a website in Umami Cloud or a self-hosted Umami instance.
2. Copy the tracking script URL and website id.
3. Set production env vars:

```dotenv
VITE_UMAMI_SRC=https://analytics.example.com/script.js
VITE_UMAMI_WEBSITE_ID=00000000-0000-0000-0000-000000000000
VITE_UMAMI_EXCLUDE_SEARCH=true
VITE_UMAMI_RESPECT_DNT=true
VITE_UMAMI_DOMAINS=darling.design,www.darling.design
```

`VITE_UMAMI_EXCLUDE_SEARCH=true` is intentional. Portfolio links can contain
`?to=company-slug`, so pageview URLs should not store raw recipient slugs by
default. Events still include `recipient: present` when a personalized link was
used.

## Clarity

Use Clarity when you want recordings and heatmaps around an active outreach
period.

```dotenv
VITE_CLARITY_PROJECT_ID=your-clarity-project-id
```

Before enabling it publicly, set the project masking mode carefully and mask URL
parameters such as `to` in Clarity if needed. The contact form is marked with
`data-clarity-mask="true"` in code.

## Events

Current custom events:

- `route_view`
- `case_opened`
- `dock_link_clicked`
- `work_cta_clicked`
- `back_clicked`
- `email_copied`
- `profile_link_clicked`
- `selected_work_requested`
- `contact_social_clicked`
- `contact_form_requested`
- `contact_form_submitted`
- `video_opened`
- `video_external_opened`

Safe event properties include `route`, `recipient`, `case_id`, `target`,
`contact_target`, `provider`, `utm_source`, `utm_medium`, and
`utm_campaign_present`.

## Local debug

Use this to verify instrumentation without sending data anywhere:

```dotenv
VITE_ANALYTICS_DEBUG=true
```
