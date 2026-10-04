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

## No Type referrals

The No Type promo card uses `https://notype.tech/?utm_source=portfolio&utm_medium=referral&utm_campaign=cross_site&utm_content=notype_card`. It preserves `product_opened` and adds `notype_site_click` for regular and middle-button clicks. The author keys on No Type link here with `utm_source=notype&utm_medium=referral&utm_campaign=cross_site&utm_content=author_button`. On initialization, that exact parameter combination emits `visit_from_notype` once per page load and sets `cross_site_source=notype` and `cross_site_entry=author_button`. Generic referrals or unrelated campaigns do not trigger this arrival event. Existing analytics configuration, including cookieless Clarity mode, is preserved.

In Clarity project `xt3hihuyx4`, select Smart events → `notype_site_click` to see sessions with a card click, or `visit_from_notype` to see arrivals from the author button. Custom tags can filter the same inbound traffic. Use filtered users/sessions for audience size; clicks can repeat. No Type project `ysdxhclm8d` has the opposite events `author_site_click` and `visit_from_portfolio`. Collection begins with this deployment; historical button attribution cannot be reconstructed.
