<?php
require_once 'Mandrill.php';

try {
    $mandrill = new Mandrill('ioScFh7TREo6yPIMxPL94g');
    $message = array(
        'html' => '<p>Example HTML content</p>',
        'text' => 'Blah Blah, does this work?',
        'subject' => 'Test Email2',
        'from_email' => 'hexagons@cfiresim.com',
        'from_name' => 'HexGameDev',
        'to' => array(
            array(
                'email' => 'lawrence.boland@gmail.com',
                'name' => 'Bo Boland',
                'type' => 'to'
            )
        ),
        'headers' => array('Reply-To' => 'hexagons@cfiresim.com'),
        'important' => false,
        'track_opens' => null,
        'track_clicks' => null,
        'auto_text' => null,
        'auto_html' => null,
        'inline_css' => null,
        'url_strip_qs' => null,
        'preserve_recipients' => null,
        'view_content_link' => null,
        'bcc_address' => null,
        'tracking_domain' => null,
        'signing_domain' => null,
        'return_path_domain' => null,
        'merge' => true,
        'global_merge_vars' =>null,
        'merge_vars' => null,
        'tags' => null,
        'subaccount' => null,
        'google_analytics_domains' => null,
        'google_analytics_campaign' => null,
        'metadata' => array('website' => 'www.cfiresim.com'),
        'recipient_metadata' => null,
        'attachments' => null
    );
    $async = false;
    $ip_pool = 'Main Pool';
    $send_at = null;
    $result = $mandrill->messages->send($message, $async, $ip_pool, $send_at);
    print_r($result);
    /*
    Array
    (
        [0] => Array
            (
                [email] => recipient.email@example.com
                [status] => sent
                [reject_reason] => hard-bounce
                [_id] => abc123abc123abc123abc123abc123
            )
    
    )
    */
} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}
?>