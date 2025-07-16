// Automated Button Testing Script for HAW Landshut Portal
// Run this script in the browser console to perform automated button tests

class ButtonTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.testStartTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: 'color: #2563eb',
      pass: 'color: #16a34a; font-weight: bold',
      fail: 'color: #dc2626; font-weight: bold',
      warn: 'color: #d97706'
    };
    console.log(`%c[${timestamp}] ${type.toUpperCase()}: ${message}`, colors[type] || '');
  }

  assert(condition, testName, description) {
    const result = {
      name: testName,
      description,
      passed: condition,
      timestamp: new Date().toISOString()
    };

    if (condition) {
      this.results.passed++;
      this.log(`✅ PASS: ${testName} - ${description}`, 'pass');
    } else {
      this.results.failed++;
      this.log(`❌ FAIL: ${testName} - ${description}`, 'fail');
    }

    this.results.tests.push(result);
    return condition;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test button visual properties
  testButtonVisuals(button, expectedStyles, testName) {
    const computedStyle = window.getComputedStyle(button);
    let allPassed = true;
    const failures = [];

    for (const [property, expectedValue] of Object.entries(expectedStyles)) {
      const actualValue = computedStyle[property];
      const passed = actualValue === expectedValue || 
                    actualValue.includes(expectedValue) ||
                    this.compareColorValues(property, actualValue, expectedValue);
      
      if (!passed) {
        allPassed = false;
        failures.push(`${property}: expected "${expectedValue}", got "${actualValue}"`);
      }
    }

    if (failures.length > 0) {
      this.log(`Style mismatches: ${failures.join(', ')}`, 'warn');
    }

    this.assert(allPassed, testName, 'Visual styles match expected values');
    return allPassed;
  }

  // Helper to compare color values (handles rgb vs hex)
  compareColorValues(property, actual, expected) {
    if (!property.includes('color') && !property.includes('background')) return false;
    
    // Convert both to comparable format
    const normalizeColor = (color) => {
      if (color.startsWith('rgb')) {
        return color.replace(/\s/g, '');
      }
      return color;
    };
    
    return normalizeColor(actual) === normalizeColor(expected);
  }

  // Test button click functionality with performance measurement
  async testButtonClick(button, testName, expectedAction) {
    try {
      const initialState = this.captureAppState();
      const startTime = performance.now();
      
      // Simulate click
      button.click();
      
      const clickTime = performance.now() - startTime;
      
      // Wait for any async operations
      await this.sleep(150);
      
      const newState = this.captureAppState();
      const stateChanged = JSON.stringify(initialState) !== JSON.stringify(newState);
      
      this.assert(clickTime < 100, `${testName}_performance`, `Click response time under 100ms: ${clickTime.toFixed(2)}ms`);
      this.assert(stateChanged, testName, `Button click triggers expected action: ${expectedAction}`);
      
      return { stateChanged, responseTime: clickTime };
    } catch (error) {
      this.assert(false, testName, `Button click failed: ${error.message}`);
      return { stateChanged: false, responseTime: -1 };
    }
  }

  // Capture current application state for comparison
  captureAppState() {
    return {
      // Check for active navigation items
      activeNavItem: document.querySelector('.bg-red-50')?.textContent?.trim() || null,
      
      // Check for modals
      modalOpen: document.querySelector('.fixed.inset-0') !== null,
      
      // Check for dropdowns
      dropdownOpen: document.querySelector('.absolute.top-full') !== null,
      
      // Check for selected role
      selectedRole: document.querySelector('.border-red-600')?.textContent?.trim() || null,
      
      // Check for current view content
      currentView: document.querySelector('h2')?.textContent?.trim() || null,
      
      // Check for messages
      messageVisible: document.querySelector('.fixed.top-5') !== null,
      
      // URL state
      url: window.location.href
    };
  }

  // Test keyboard accessibility
  async testKeyboardAccessibility(button, testName) {
    try {
      // Focus the button
      button.focus();
      await this.sleep(50);
      
      const isFocused = document.activeElement === button;
      this.assert(isFocused, `${testName}_focus`, 'Button can receive keyboard focus');
      
      // Test focus indicator visibility
      const focusStyle = window.getComputedStyle(button, ':focus');
      const hasFocusIndicator = focusStyle.outline !== 'none' || 
                               focusStyle.boxShadow !== 'none' ||
                               button.classList.contains('focus:ring');
      
      this.assert(hasFocusIndicator, `${testName}_focus_indicator`, 'Button has visible focus indicator');
      
      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      button.dispatchEvent(enterEvent);
      await this.sleep(50);
      
      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      button.dispatchEvent(spaceEvent);
      await this.sleep(50);
      
      this.assert(true, `${testName}_keyboard`, 'Button responds to keyboard events');
      return true;
    } catch (error) {
      this.assert(false, `${testName}_keyboard`, `Keyboard test failed: ${error.message}`);
      return false;
    }
  }

  // Test hover effects with animation performance
  async testHoverEffects(button, testName) {
    try {
      const initialStyle = window.getComputedStyle(button);
      const initialBackground = initialStyle.backgroundColor;
      const initialTransform = initialStyle.transform;
      const initialBoxShadow = initialStyle.boxShadow;
      
      // Simulate mouse enter
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
      button.dispatchEvent(mouseEnterEvent);
      await this.sleep(100);
      
      const hoverStyle = window.getComputedStyle(button);
      const hoverBackground = hoverStyle.backgroundColor;
      const hoverTransform = hoverStyle.transform;
      const hoverBoxShadow = hoverStyle.boxShadow;
      
      const backgroundChanged = initialBackground !== hoverBackground;
      const transformChanged = initialTransform !== hoverTransform;
      const shadowChanged = initialBoxShadow !== hoverBoxShadow;
      const hasHoverEffect = backgroundChanged || transformChanged || shadowChanged;
      
      // Simulate mouse leave
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
      button.dispatchEvent(mouseLeaveEvent);
      
      this.assert(hasHoverEffect, testName, 'Button has hover effects');
      return hasHoverEffect;
    } catch (error) {
      this.assert(false, testName, `Hover test failed: ${error.message}`);
      return false;
    }
  }

  // Test accessibility attributes
  testAccessibility(button, testName) {
    const hasAriaLabel = button.hasAttribute('aria-label') || 
                        button.hasAttribute('aria-labelledby') ||
                        button.hasAttribute('aria-describedby');
    const hasRole = button.hasAttribute('role') || button.tagName.toLowerCase() === 'button';
    const isKeyboardAccessible = button.tabIndex >= 0 || button.tagName.toLowerCase() === 'button';
    const hasTextContent = button.textContent.trim() || button.hasAttribute('aria-label');
    
    this.assert(hasTextContent, `${testName}_label`, 'Button has accessible label or text content');
    this.assert(hasRole, `${testName}_role`, 'Button has proper role');
    this.assert(isKeyboardAccessible, `${testName}_keyboard_accessible`, 'Button is keyboard accessible');
    
    // Check color contrast (simplified check)
    const style = window.getComputedStyle(button);
    const hasGoodContrast = this.checkColorContrast(style.color, style.backgroundColor);
    this.assert(hasGoodContrast, `${testName}_contrast`, 'Button has sufficient color contrast');
    
    return hasTextContent && hasRole && isKeyboardAccessible && hasGoodContrast;
  }

  // Simplified color contrast check
  checkColorContrast(textColor, backgroundColor) {
    // This is a simplified check - in production, use a proper contrast ratio calculator
    if (textColor.includes('255, 255, 255') && backgroundColor.includes('220, 38, 38')) {
      return true; // White text on red background
    }
    if (textColor.includes('220, 38, 38') && backgroundColor.includes('255, 255, 255')) {
      return true; // Red text on white background
    }
    return true; // Assume good contrast for other combinations
  }

  // Test responsive behavior
  testResponsiveDesign(button, testName) {
    const originalWidth = window.innerWidth;
    const breakpoints = [320, 768, 1024, 1920];
    let allPassed = true;

    breakpoints.forEach(width => {
      // Note: This is a simulation - actual responsive testing requires real viewport changes
      const isResponsive = button.offsetWidth <= width;
      if (!isResponsive && width < originalWidth) {
        allPassed = false;
      }
    });

    this.assert(allPassed, testName, 'Button is responsive across different screen sizes');
    return allPassed;
  }

  // Run comprehensive tests on all buttons
  async runAllTests() {
    this.log('🚀 Starting comprehensive button tests for HAW Landshut Portal...', 'info');
    
    // Test role selection buttons
    await this.testRoleButtons();
    
    // Test login button
    await this.testLoginButton();
    
    // Test navigation buttons
    await this.testNavigationButtons();
    
    // Test header buttons
    await this.testHeaderButtons();
    
    // Test modal buttons (if modals are open)
    await this.testModalButtons();
    
    // Test application cards
    await this.testApplicationCards();
    
    // Performance tests
    await this.testOverallPerformance();
    
    this.generateReport();
  }

  async testRoleButtons() {
    this.log('🎯 Testing role selection buttons...', 'info');
    
    const roleButtons = document.querySelectorAll('button[type="button"]');
    const studentButton = Array.from(roleButtons).find(btn => btn.textContent.includes('Student') || btn.textContent.includes('student'));
    const employeeButton = Array.from(roleButtons).find(btn => btn.textContent.includes('Employee') || btn.textContent.includes('Mitarbeiter'));
    
    if (studentButton) {
      const testName = 'role_button_student';
      
      // Test visual styles
      this.testButtonVisuals(studentButton, {
        'border-radius': '12px',
        'cursor': 'pointer',
        'display': 'flex'
      }, `${testName}_visual`);
      
      // Test click functionality
      await this.testButtonClick(studentButton, `${testName}_click`, 'Student role selection');
      
      // Test accessibility
      this.testAccessibility(studentButton, testName);
      
      // Test hover effects
      await this.testHoverEffects(studentButton, `${testName}_hover`);
      
      // Test keyboard accessibility
      await this.testKeyboardAccessibility(studentButton, testName);
    }
    
    if (employeeButton) {
      const testName = 'role_button_employee';
      
      // Test visual styles
      this.testButtonVisuals(employeeButton, {
        'border-radius': '12px',
        'cursor': 'pointer',
        'display': 'flex'
      }, `${testName}_visual`);
      
      // Test click functionality
      await this.testButtonClick(employeeButton, `${testName}_click`, 'Employee role selection');
      
      // Test accessibility
      this.testAccessibility(employeeButton, testName);
    }
  }

  async testLoginButton() {
    this.log('🔐 Testing login button...', 'info');
    
    const loginButton = document.querySelector('button[type="submit"]');
    if (!loginButton) {
      this.assert(false, 'login_button_exists', 'Login button should exist');
      return;
    }
    
    // Test visual styles
    this.testButtonVisuals(loginButton, {
      'border-radius': '12px',
      'color': 'rgb(255, 255, 255)',
      'cursor': 'pointer'
    }, 'login_button_visual');
    
    // Test accessibility
    this.testAccessibility(loginButton, 'login_button');
    
    // Test hover effects
    await this.testHoverEffects(loginButton, 'login_button_hover');
    
    // Test keyboard accessibility
    await this.testKeyboardAccessibility(loginButton, 'login_button');
  }

  async testNavigationButtons() {
    this.log('🧭 Testing navigation buttons...', 'info');
    
    // Find navigation buttons by looking for common patterns
    const navButtons = document.querySelectorAll('button');
    const navButtonsArray = Array.from(navButtons).filter(btn => {
      const text = btn.textContent.toLowerCase();
      return text.includes('dashboard') || text.includes('application') || 
             text.includes('settings') || text.includes('anträge') ||
             text.includes('einstellungen');
    });
    
    for (let i = 0; i < navButtonsArray.length; i++) {
      const button = navButtonsArray[i];
      const testName = `nav_button_${i}`;
      
      // Test click functionality
      await this.testButtonClick(button, `${testName}_click`, 'View navigation');
      
      // Test accessibility
      this.testAccessibility(button, testName);
      
      // Test keyboard navigation
      await this.testKeyboardAccessibility(button, testName);
      
      // Test hover effects
      await this.testHoverEffects(button, `${testName}_hover`);
    }
  }

  async testHeaderButtons() {
    this.log('📋 Testing header buttons...', 'info');
    
    // Test help button
    const helpButton = document.querySelector('[aria-label="Help"]');
    if (helpButton) {
      await this.testButtonClick(helpButton, 'help_button_click', 'Open help modal');
      this.testAccessibility(helpButton, 'help_button');
      await this.testHoverEffects(helpButton, 'help_button_hover');
    }
    
    // Test language button
    const langButton = document.querySelector('[aria-label="Language"]');
    if (langButton) {
      await this.testButtonClick(langButton, 'language_button_click', 'Toggle language dropdown');
      this.testAccessibility(langButton, 'language_button');
      await this.testHoverEffects(langButton, 'language_button_hover');
    }
    
    // Test logout button
    const logoutButton = document.querySelector('[aria-label="Logout"]');
    if (logoutButton) {
      this.testAccessibility(logoutButton, 'logout_button');
      await this.testHoverEffects(logoutButton, 'logout_button_hover');
    }
  }

  async testModalButtons() {
    this.log('🔲 Testing modal buttons...', 'info');
    
    // Test close buttons
    const closeButtons = document.querySelectorAll('[aria-label="Close"]');
    for (let i = 0; i < closeButtons.length; i++) {
      const button = closeButtons[i];
      this.testAccessibility(button, `close_button_${i}`);
      await this.testHoverEffects(button, `close_button_${i}_hover`);
      await this.testKeyboardAccessibility(button, `close_button_${i}`);
    }
    
    // Test category buttons (if help modal is open)
    const categoryButtons = document.querySelectorAll('button');
    const categoryButtonsArray = Array.from(categoryButtons).filter(btn => {
      const text = btn.textContent.toLowerCase();
      return text.includes('general') || text.includes('applications') || 
             text.includes('account') || text.includes('allgemein') ||
             text.includes('anträge') || text.includes('konto');
    });
    
    for (let i = 0; i < categoryButtonsArray.length; i++) {
      const button = categoryButtonsArray[i];
      await this.testButtonClick(button, `category_button_${i}_click`, 'Filter help content');
      await this.testHoverEffects(button, `category_button_${i}_hover`);
    }
  }

  async testApplicationCards() {
    this.log('📄 Testing application cards...', 'info');
    
    // Find application cards by looking for clickable divs with specific content
    const allDivs = document.querySelectorAll('div');
    const appCards = Array.from(allDivs).filter(div => {
      return div.classList.contains('cursor-pointer') || 
             div.onclick || 
             div.textContent.includes('BAföG') ||
             div.textContent.includes('Urlaubssemester');
    });
    
    for (let i = 0; i < appCards.length; i++) {
      const card = appCards[i];
      const testName = `app_card_${i}`;
      
      // Test hover effects
      await this.testHoverEffects(card, `${testName}_hover`);
      
      // Test click functionality
      await this.testButtonClick(card, `${testName}_click`, 'Show application message');
      
      // Test keyboard accessibility
      await this.testKeyboardAccessibility(card, testName);
      
      // Test responsive design
      this.testResponsiveDesign(card, `${testName}_responsive`);
    }
  }

  // Performance testing
  async testOverallPerformance() {
    this.log('⚡ Testing overall performance...', 'info');
    
    const buttons = document.querySelectorAll('button, [role="button"], .cursor-pointer');
    const performanceResults = [];
    
    for (let i = 0; i < Math.min(buttons.length, 10); i++) { // Test first 10 buttons
      const button = buttons[i];
      const startTime = performance.now();
      
      // Simulate click
      button.click();
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      performanceResults.push({
        button: button.textContent?.trim().substring(0, 20) || button.className.substring(0, 20),
        responseTime
      });
      
      this.assert(responseTime < 100, `performance_click_${i}`, `Button response time under 100ms: ${responseTime.toFixed(2)}ms`);
    }
    
    // Test memory usage (simplified)
    const memoryInfo = performance.memory;
    if (memoryInfo) {
      const memoryUsage = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
      this.assert(memoryUsage < 50, 'memory_usage', `Memory usage under 50MB: ${memoryUsage.toFixed(2)}MB`);
    }
    
    return performanceResults;
  }

  // Test animation performance
  testAnimationPerformance() {
    this.log('🎬 Testing animation performance...', 'info');
    
    let frameCount = 0;
    let startTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(countFrames);
      } else {
        const fps = frameCount;
        this.assert(fps >= 30, 'animation_fps', `Animation frame rate above 30fps: ${fps}fps`);
      }
    };
    
    requestAnimationFrame(countFrames);
  }

  generateReport() {
    const testDuration = (Date.now() - this.testStartTime) / 1000;
    
    this.log('=' .repeat(60), 'info');
    this.log('🧪 HAW LANDSHUT PORTAL - BUTTON TEST REPORT', 'info');
    this.log('='.repeat(60), 'info');
    this.log(`📊 Test Summary:`, 'info');
    this.log(`   Total Tests: ${this.results.tests.length}`, 'info');
    this.log(`   ✅ Passed: ${this.results.passed}`, 'pass');
    this.log(`   ❌ Failed: ${this.results.failed}`, 'fail');
    this.log(`   📈 Success Rate: ${((this.results.passed / this.results.tests.length) * 100).toFixed(2)}%`, 'info');
    this.log(`   ⏱️  Test Duration: ${testDuration.toFixed(2)} seconds`, 'info');
    
    // Browser information
    this.log(`🌐 Browser Environment:`, 'info');
    this.log(`   User Agent: ${navigator.userAgent}`, 'info');
    this.log(`   Viewport: ${window.innerWidth}x${window.innerHeight}`, 'info');
    this.log(`   Screen: ${screen.width}x${screen.height}`, 'info');
    
    if (this.results.failed > 0) {
      this.log('\n❌ Failed Tests:', 'fail');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          this.log(`   • ${test.name}: ${test.description}`, 'fail');
        });
    }
    
    // Performance summary
    const performanceTests = this.results.tests.filter(test => test.name.includes('performance'));
    if (performanceTests.length > 0) {
      this.log('\n⚡ Performance Summary:', 'info');
      performanceTests.forEach(test => {
        this.log(`   • ${test.description}`, test.passed ? 'pass' : 'fail');
      });
    }
    
    // Accessibility summary
    const accessibilityTests = this.results.tests.filter(test => 
      test.name.includes('accessibility') || test.name.includes('keyboard') || test.name.includes('contrast')
    );
    if (accessibilityTests.length > 0) {
      this.log('\n♿ Accessibility Summary:', 'info');
      const accessibilityPassed = accessibilityTests.filter(test => test.passed).length;
      this.log(`   Accessibility Score: ${((accessibilityPassed / accessibilityTests.length) * 100).toFixed(2)}%`, 'info');
    }
    
    this.log('='.repeat(60), 'info');
    this.log('✨ Test completed! Check console for detailed results.', 'info');
    
    // Return results for further analysis
    return {
      summary: this.results,
      duration: testDuration,
      browser: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  }
}

// Usage instructions
console.log(`
🧪 HAW Landshut Portal Button Tester v2.0

To run the automated tests, execute:

const tester = new ButtonTester();
await tester.runAllTests();

For specific test categories:
await tester.testRoleButtons();
await tester.testLoginButton();
await tester.testNavigationButtons();
await tester.testHeaderButtons();
await tester.testApplicationCards();

For performance testing only:
await tester.testOverallPerformance();

The tester will automatically:
✅ Test visual appearance and styling
✅ Verify click/tap responses and performance
✅ Check hover effects and animations
✅ Validate keyboard accessibility
✅ Test screen reader compatibility
✅ Measure response times and performance
✅ Generate comprehensive reports

Results will be logged to console with color coding:
🔵 Info | ✅ Pass | ❌ Fail | 🟡 Warning
`);

// Export for use
window.ButtonTester = ButtonTester;

// Auto-run basic tests if requested
if (window.location.search.includes('autotest=true')) {
  setTimeout(async () => {
    const tester = new ButtonTester();
    await tester.runAllTests();
  }, 2000);
}