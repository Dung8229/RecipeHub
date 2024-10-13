jQuery(document).ready(function($) {
    var $form_modal = $('.user-modal'),
        $form_login = $('#login'),
        $form_signup = $('#signup'),
        $form_forgot_password = $('#reset-password'),
        $form_modal_tab = $('.switcher'),
        $tab_login = $form_modal_tab.find('a').eq(0),
        $tab_signup = $form_modal_tab.find('a').eq(1),
        $forgot_password_link = $form_login.find('.form-bottom-message a'),
        $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
        $main_nav = $('.main-nav');

    // Mở modal khi nhấn vào nút đăng nhập/đăng ký
    $main_nav.on('click', function(event) {
        if ($(event.target).is($main_nav)) {
            $(this).children('ul').toggleClass('is-visible');
        } else {
            $main_nav.children('ul').removeClass('is-visible');
            $form_modal.addClass('is-visible');
            ($(event.target).hasClass('signup')) ? signup_selected() : login_selected();
        }
    });

    // Đóng modal khi nhấn vào vùng ngoài hoặc nút đóng
    $('.user-modal, .close-form').on('click', function(event) {
        if ($(event.target).is($form_modal) || $(event.target).is('.close-form')) {
            $form_modal.removeClass('is-visible');
        }
    });

    // Đóng modal khi nhấn phím ESC
    $(document).on('keyup', function(event) {
        if (event.key === 'Escape') {
            $form_modal.removeClass('is-visible');
        }
    });

    // Chuyển đổi giữa tab đăng nhập và đăng ký
    $form_modal_tab.on('click', 'a', function(event) {
        event.preventDefault();
        ($(event.target).is($tab_login)) ? login_selected() : signup_selected();
    });

    // Hiển thị hoặc ẩn mật khẩu
    $('.hide-password').on('click', function() {
        var $this = $(this),
            $password_field = $this.prev('input');
        
        $password_field.attr('type', ($password_field.attr('type') === 'password') ? 'text' : 'password');
        $this.text(($this.text() === 'Show') ? 'Hide' : 'Show');
        $password_field.putCursorAtEnd(); // Đưa con trỏ về cuối
    });

    // Chuyển sang form khôi phục mật khẩu
    $forgot_password_link.on('click', function(event) {
        event.preventDefault();
        forgot_password_selected();
    });

    // Trở về form đăng nhập từ form khôi phục mật khẩu
    $back_to_login_link.on('click', function(event) {
        event.preventDefault();
        login_selected();
    });

    // Hàm chuyển đổi tab
    function login_selected() {
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }

    function signup_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }

    function forgot_password_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.addClass('is-selected');
    }

    // Thêm tính năng di chuyển con trỏ về cuối input
    $.fn.putCursorAtEnd = function() {
        return this.each(function() {
            if (this.setSelectionRange) {
                var len = $(this).val().length;
                this.setSelectionRange(len, len);
            }
        });
    };



    // Xử lý đăng nhập
    $('#login-form').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        var email = $('#login-email').val();
        var password = $('#login-password').val();

        // Gửi yêu cầu đến server
        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function(response) {
                alert(response.message); // Hiển thị thông báo thành công
                // Chuyển hướng đến trang khác nếu cần
                window.location.href = '/dashboard'; // Hoặc bất kỳ trang nào bạn muốn
            },
            error: function(xhr) {
                alert(xhr.responseJSON.error); // Hiển thị thông báo lỗi
            }
        });
    });

    // Xử lý đăng ký
    $('#signup-form').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        var username = $('#signup-username').val();
        var email = $('#signup-email').val();
        var password = $('#signup-password').val();

        // Gửi yêu cầu đến server
        $.ajax({
            url: '/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
            success: function(response) {
                alert(response.message); // Hiển thị thông báo thành công
                // Có thể chuyển hướng đến trang đăng nhập hoặc trang khác
                window.location.href = '/login'; // Hoặc bất kỳ trang nào bạn muốn
            },
            error: function(xhr) {
                alert(xhr.responseJSON.error); // Hiển thị thông báo lỗi
            }
        });
    });
});
