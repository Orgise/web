$(function() {
    // Define potential password characters
    var alphaLower = 'abcdefghijklmnopqrstuvwxyz';
    var alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers    = '1234567890';
    var symbols    = '`~!@#$%^&*()_-+={}[]\\|:;\"\'<>,.?/';
    var spaces     = ' ';

    // Define presets
    var presets = {
        'WEP (64-bit)': {
            'pass-length': 5,
            'alpha-lower': true,
            'alpha-upper': true,
            'numbers': true,
            'symbols': true,
            'spaces': true,
            'similar': true
        },
        'WEP (128-bit)': {
            'pass-length': 13,
            'alpha-lower': true,
            'alpha-upper': true,
            'numbers': true,
            'symbols': true,
            'spaces': true,
            'similar': true
        },
        'WEP (152-bit)': {
            'pass-length': 16,
            'alpha-lower': true,
            'alpha-upper': true,
            'numbers': true,
            'symbols': true,
            'spaces': true,
            'similar': true
        },
        'WEP (256-bit)': {
            'pass-length': 29,
            'alpha-lower': true,
            'alpha-upper': true,
            'numbers': true,
            'symbols': true,
            'spaces': true,
            'similar': true
        },
        'WPA-PSK': {
            'pass-length': 63,
            'alpha-lower': true,
            'alpha-upper': true,
            'numbers': true,
            'symbols': true,
            'spaces': true,
            'similar': true
        }
    };

    // Populate select field with all defined presets
    $.each(presets, function(key) {
        $('.template').append('<option value="'+key+'">'+key+'</option>');
    });

    // Function to generate passwords
    function generatePassword() {
        // Set requirements based on page input values
        var requirements = {};
        requirements['pass-length'] = $('#password-generator .pass-length').val();
        requirements['alpha-lower'] = $('#password-generator .alpha-lower').is(':checked') ? true : false;
        requirements['alpha-upper'] = $('#password-generator .alpha-upper').is(':checked') ? true : false;
        requirements['numbers']     = $('#password-generator .numbers').is(':checked') ? true : false;
        requirements['symbols']     = $('#password-generator .symbols').is(':checked') ? true : false;
        requirements['spaces']      = $('#password-generator .spaces').is(':checked') ? true : false;
        requirements['similar']     = $('#password-generator .similar').is(':checked') ? true : false;

        // Build pool of valid characters
        var characterPool = '';
        if (requirements['alpha-lower'])
            characterPool += alphaLower;
        if (requirements['alpha-upper'])
            characterPool += alphaUpper;
        if (requirements['numbers'])
            characterPool += numbers;
        if (requirements['symbols'])
            characterPool += symbols;
        if (requirements['spaces'])
            characterPool += spaces;
        if (!requirements['similar'])
            characterPool = characterPool.replace(/[0O1IlB8\|]/g,'');
        
        // Generate and return password
        var password = '';
        for (var i = 0; i < requirements['pass-length']; i++)
            password += characterPool.charAt(Math.floor(Math.random() * characterPool.length));

        return password;
    }

    // On form submission, validate inputs and generate password
    $('#password-generator form').on('submit', function() {
        // Return if password requested is too long or short
        if ($('.pass-length').val() < 4 || $('.pass-length').val() > 256) {
            displayError('Invalid length. Please select a length between 4 and 256.', '#password-generator');
            return false;
        }

        // Generate password and place in the output textarea
        $('.password-output').text(generatePassword()).select();

        // Prevent default form submission
        return false;
    });

    // Set template to custom when any change is made
    $('#password-generator').on('change', 'input', function() {
        $('.template').val('custom');
    });

    // Load presets when selecting a non-custom template
    $('#password-generator').on('change', '.template', function() {
        // Get name of requested template
        var template = $(this).val();
        
        // Return if using a custom template
        if (template == 'custom')
            return;

        // Loop through template object and fill out form based on values
        $.each(presets[template], function(key, value) {
            if (typeof value === 'boolean')
                $('#password-generator .' + key).prop('checked', value);
            else
                $('#password-generator .' + key).val(value);
        });
    });
});