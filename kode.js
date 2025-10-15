$(document).ready(function() {
  
  // ===== NAVBAR SCROLL EFFECT =====
  $(window).scroll(function() {
    $('header').toggleClass('scrolled', $(this).scrollTop() > 100);
    $('.scroll-top').toggleClass('show', $(this).scrollTop() > 300);
  });

  // ===== DARK MODE TOGGLE =====
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    $('body').addClass('dark-mode');
    $('#modeToggle').prop('checked', true);
    $('.mode-text').text('Mode Terang');
  }

  $(document).on('change', '#modeToggle', function() {
    $('body').toggleClass('dark-mode');
    const isDark = $('body').hasClass('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    $('.mode-text').text(isDark ? 'Mode Terang' : 'Mode Gelap');
    $('.mobile-sidebar #modeToggle').prop('checked', isDark);
  });

  // ===== MOBILE MENU =====
  function createMobileMenu() {
    if ($(window).width() <= 1000 && !$('.mobile-sidebar').length) {
      const $nav = $('nav');
      const $navList = $nav.find('ul').clone();
      const $switchControl = $nav.find('.switch').clone();
      
      // Menu icon
      $('<div class="menu-icon"><span></span><span></span><span></span></div>').appendTo($nav);
      
      // Overlay & Sidebar
      $('<div class="overlay"></div>').appendTo('body');
      const $sidebar = $('<div class="mobile-sidebar"></div>').appendTo('body');
      $('<button class="sidebar-close">&times;</button>').appendTo($sidebar);
      
      // Add title to sidebar
      $('<h2>🎓 Menu</h2>').appendTo($sidebar);
      
      $navList.appendTo($sidebar);
      $switchControl.appendTo($sidebar);
      
      // Sync dark mode state
      $sidebar.find('#modeToggle').prop('checked', $('body').hasClass('dark-mode'));
      
      // Set active link in mobile sidebar
      const currentPage = window.location.pathname.split('/').pop() || 'home.html';
      $sidebar.find('a').removeClass('active');
      $sidebar.find('a[href="' + currentPage + '"]').addClass('active');
    }
  }

  createMobileMenu();

  // Toggle mobile menu
  $(document).on('click', '.menu-icon', function() {
    $('.mobile-sidebar, .overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  });

  $(document).on('click', '.sidebar-close, .overlay, .mobile-sidebar a', function() {
    $('.mobile-sidebar, .overlay').removeClass('active');
    $('body').css('overflow', '');
  });

  // Handle resize
  let resizeTimer;
  $(window).resize(function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if ($(window).width() > 1000) {
        $('.mobile-sidebar, .overlay, .menu-icon').remove();
        $('body').css('overflow', '');
      } else {
        createMobileMenu();
      }
    }, 250);
  });

  // ===== SCROLL TO TOP BUTTON =====
  if (!$('.scroll-top').length) {
    $('<button class="scroll-top" aria-label="Kembali ke atas">↑</button>').appendTo('body');
  }

  $('.scroll-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // ===== REVIEW SYSTEM =====
  let reviews = [];

  function getStarRating(rating) {
    return '⭐'.repeat(parseInt(rating));
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function renderReviews() {
    const $container = $('#ulasanContainer');
    if (!$container.length) return;
    
    $container.empty();
    
    if (reviews.length === 0) {
      $container.html('<p style="text-align: center; color: #999; padding: 2rem;">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>');
      return;
    }
    
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((review, index) => {
      const $item = $(`
        <li class="review-item" style="animation-delay: ${index * 0.1}s">
          <div class="review-header">
            <span class="review-name">${$('<div>').text(review.nama).html()}</span>
            <span class="review-rating">${getStarRating(review.rating)}</span>
          </div>
          <p class="review-text">${$('<div>').text(review.ulasan).html()}</p>
          <p class="review-date">${formatDate(review.date)}</p>
        </li>
      `);
      $container.append($item);
    });
  }

  $('#reviewForm').submit(function(e) {
    e.preventDefault();
    
    const nama = $('#nama').val().trim();
    const rating = $('#rating').val();
    const ulasan = $('#ulasan').val().trim();
    
    if (!nama || !rating || !ulasan) {
      alert('Mohon lengkapi semua field!');
      return;
    }
    
    reviews.unshift({
      id: Date.now(),
      nama: nama,
      rating: rating,
      ulasan: ulasan,
      date: new Date().toISOString()
    });
    
    renderReviews();
    this.reset();
    
    // Success message
    const $msg = $(`<div style="position: fixed; top: 100px; right: 20px; background: linear-gradient(135deg, #4A90E2, #7B68EE); color: white; padding: 1rem 2rem; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); z-index: 10000; font-weight: 600;">✓ Ulasan berhasil dikirim!</div>`);
    $('body').append($msg);
    
    setTimeout(() => {
      $msg.fadeOut(500, () => $msg.remove());
      $('html, body').animate({ scrollTop: $('#reviewList').offset().top - 80 }, 600);
    }, 3000);
  });

  renderReviews();

  // ===== SMOOTH SCROLL =====
  $('a[href^="#"]').click(function(e) {
    const href = $(this).attr('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = $(href);
    if (target.length) {
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600);
    }
  });

  // ===== SET ACTIVE PAGE LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  
  // Remove all active classes first
  $('nav a, .mobile-sidebar a, footer a').removeClass('active');
  
  // Add active class to current page links (only for page links, not anchor links)
  $('nav a[href="' + currentPage + '"], footer a[href="' + currentPage + '"]').addClass('active');
  
  // Don't add active to anchor links initially
  $('nav a[href^="#"], footer a[href^="#"]').removeClass('active');

  // ===== ACTIVE SECTION LINK ON SCROLL (Only for anchor links on home page) =====
  $(window).scroll(function() {
    const scrollY = $(this).scrollTop();
    
    // Only highlight section links if we're on home page with sections
    if (currentPage === 'home.html' && $('section[id]').length > 0) {
      let activeFound = false;
      
      $('section[id]').each(function() {
        const $section = $(this);
        const sectionTop = $section.offset().top - 150;
        const sectionHeight = $section.outerHeight();
        const sectionId = $section.attr('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          // Remove active from page links when in section
          $('nav a[href$=".html"]').removeClass('active');
          // Add active only to section link
          $('nav a[href^="#"]').removeClass('active');
          $('nav a[href="#' + sectionId + '"]').addClass('active');
          activeFound = true;
        }
      });
      
      // If no section is active and we're at top, activate home
      if (!activeFound && scrollY < 300) {
        $('nav a[href^="#"]').removeClass('active');
        $('nav a[href="home.html"]').addClass('active');
      }
    }
  });

  // ===== ANIMATION ON SCROLL =====
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).css({ opacity: '1', transform: 'translateY(0)' });
      }
    });
  }, observerOptions);

  $('.card, .team-member, .timeline-item').each(function() {
    $(this).css({ opacity: '0', transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' });
    observer.observe(this);
  });

  // ===== PAGE LOAD ANIMATION =====
  $('body').css('opacity', '0').animate({ opacity: 1 }, 500);

  // ===== CONSOLE MESSAGE =====
  console.log('%c🎓 AZA Academy', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
  console.log('%cWebsite bimbingan belajar terpercaya di Surabaya', 'font-size: 14px; color: #7B68EE;');
  console.log('%cDibuat untuk UTS Pemrograman Web', 'font-size: 12px; color: #999;');
});

// Animation styles
$('<style>@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}</style>').appendTo('head');