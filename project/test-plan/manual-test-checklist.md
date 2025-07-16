# Manual Test Checklist - HAW Landshut Portal Buttons

## Pre-Test Setup
- [ ] Clear browser cache and cookies
- [ ] Disable browser extensions that might interfere
- [ ] Set browser zoom to 100%
- [ ] Ensure stable internet connection
- [ ] Have screen reader software ready (if testing accessibility)

## Test Environment Information
**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________ **Version**: ___________  
**OS**: ___________ **Version**: ___________  
**Screen Resolution**: ___________  
**Device**: ___________  

---

## TC001: Role Selection Buttons (Login Page)

### Visual Appearance ✓/✗
- [ ] Both buttons (Student/Employee) are visible and properly aligned
- [ ] Buttons have equal width and height in grid layout
- [ ] **Inactive state**: Gray border (#e5e7eb), white background
- [ ] **Active state**: Red border (#dc2626), red background (#fef2f2), red text
- [ ] **Hover state**: Border color darkens appropriately
- [ ] User icon displays correctly above text
- [ ] Text is centered and readable
- [ ] Border radius is 12px (rounded corners)
- [ ] Consistent padding (16px) on all sides

### Interaction Testing ✓/✗
- [ ] Click on Student button - immediate visual feedback
- [ ] Click on Employee button - immediate visual feedback
- [ ] Only one button can be active at a time
- [ ] Email placeholder updates when role changes
- [ ] Double-click doesn't cause issues
- [ ] Touch interaction works on mobile devices

### Animation Testing ✓/✗
- [ ] Color transitions are smooth (approximately 0.2s)
- [ ] No flickering during state changes
- [ ] Hover effects are smooth and responsive
- [ ] Active state change is immediate

### Accessibility Testing ✓/✗
- [ ] Tab key navigates between buttons correctly
- [ ] Enter key activates the focused button
- [ ] Space key activates the focused button
- [ ] Focus indicator is clearly visible
- [ ] Screen reader announces button purpose and state
- [ ] Color contrast meets WCAG standards

**Issues Found**: ___________  
**Notes**: ___________

---

## TC002: Login Submit Button

### Visual Appearance ✓/✗
- [ ] Button spans full width of form container
- [ ] Height is appropriate (48px minimum)
- [ ] Red gradient background (#dc2626 to #b91c1c)
- [ ] White text, semibold weight
- [ ] Text displays correctly: "Anmelden" (DE) / "Sign In" (EN)
- [ ] Border radius is 12px
- [ ] Subtle shadow for depth

### Interaction Testing ✓/✗
- [ ] **Hover effect**: Background darkens appropriately
- [ ] **Transform effect**: Slight scale increase (1.05x) on hover
- [ ] **Click response**: Form submission triggers
- [ ] **Active state**: Brief scale down (0.98x) on click
- [ ] Button prevents submission when form is invalid
- [ ] Loading state displays during submission (if implemented)

### Form Validation Testing ✓/✗
- [ ] Prevents submission with empty email field
- [ ] Prevents submission with empty password field
- [ ] Validates email format correctly
- [ ] Shows appropriate error messages
- [ ] Successful login redirects to dashboard
- [ ] Error handling for invalid credentials

### Performance Testing ✓/✗
- [ ] Click response time under 100ms
- [ ] Hover animations run at 60fps
- [ ] No memory leaks on repeated interactions
- [ ] Form submission completes within reasonable time

**Issues Found**: ___________  
**Notes**: ___________

---

## TC003: Language Toggle Button (Header)

### Visual Appearance ✓/✗
- [ ] Button size is 40px × 40px
- [ ] Globe icon displays correctly (20px size)
- [ ] **Default state**: Gray color (#6b7280)
- [ ] **Hover state**: Red color (#dc2626), light gray background
- [ ] Border radius is 8px
- [ ] Proper positioning in header

### Dropdown Testing ✓/✗
- [ ] Dropdown appears below button, right-aligned
- [ ] Shows both language options (German 🇩🇪, English 🇺🇸)
- [ ] Current language is highlighted
- [ ] Clicking outside closes dropdown
- [ ] Escape key closes dropdown
- [ ] Dropdown has proper z-index (appears above other content)

### Language Change Testing ✓/✗
- [ ] Selecting German updates all text immediately
- [ ] Selecting English updates all text immediately
- [ ] Language preference persists across page refreshes
- [ ] All UI elements update correctly (buttons, labels, placeholders)
- [ ] Help content updates to selected language
- [ ] Form validation messages update to selected language

### Accessibility Testing ✓/✗
- [ ] Button has proper aria-label ("Language")
- [ ] Keyboard navigation works (Tab to focus, Enter to open)
- [ ] Arrow keys navigate dropdown options
- [ ] Screen reader announces language options
- [ ] Focus management works correctly in dropdown

**Issues Found**: ___________  
**Notes**: ___________

---

## TC004: Navigation Sidebar Buttons (Dashboard)

### Visual Appearance ✓/✗
- [ ] All navigation buttons are visible and properly aligned
- [ ] Consistent spacing between buttons (8px)
- [ ] Icons are 20px × 20px and display correctly
- [ ] **Active state**: Red background (#fef2f2), red text (#dc2626)
- [ ] **Inactive state**: Gray text (#374151), transparent background
- [ ] **Hover state**: Light gray background (#f9fafb)
- [ ] Text is medium weight, 14px size

### Navigation Testing ✓/✗
- [ ] Dashboard button loads dashboard view
- [ ] New Application button loads application types
- [ ] My Applications button loads applications list/empty state
- [ ] Settings button loads settings form
- [ ] Only one button shows active state at a time
- [ ] View transitions are smooth and immediate

### Content Loading Testing ✓/✗
- [ ] **Dashboard**: Statistics cards and recent applications display
- [ ] **New Application**: Application type grid displays correctly
- [ ] **My Applications**: Empty state message displays appropriately
- [ ] **Settings**: Profile form loads with current user data
- [ ] Content updates without page refresh
- [ ] Loading states display if applicable

### Responsive Testing ✓/✗
- [ ] **Desktop (>1024px)**: Full sidebar visible
- [ ] **Tablet (768px-1024px)**: Sidebar maintains layout
- [ ] **Mobile (<768px)**: Navigation adapts appropriately
- [ ] Smooth transitions at breakpoints
- [ ] Touch targets are adequate on mobile (44px minimum)

**Issues Found**: ___________  
**Notes**: ___________

---

## TC005: Application Type Cards (New Application View)

### Visual Appearance ✓/✗
- [ ] Cards have consistent sizing and spacing
- [ ] Grid layout works correctly (responsive)
- [ ] Emoji icons display correctly (64px size)
- [ ] Gradient backgrounds match design system
- [ ] **Title**: 20px, bold weight, readable
- [ ] **Description**: 14px, gray color (#6b7280)
- [ ] Category badges display role correctly
- [ ] Border radius is 16px
- [ ] Subtle shadow for depth

### Hover Effects Testing ✓/✗
- [ ] Shadow increases on hover
- [ ] Card moves up slightly (-4px translateY)
- [ ] Subtle scale increase (1.02x)
- [ ] Icon scales up (1.1x)
- [ ] Transitions are smooth (0.3s ease-out)
- [ ] Effects reverse when hover ends

### Interaction Testing ✓/✗
- [ ] Click shows success message immediately
- [ ] Message displays correct application type name
- [ ] Message auto-dismisses after 3 seconds
- [ ] Message appears in top-right corner
- [ ] Multiple rapid clicks don't cause issues
- [ ] Touch interaction works on mobile

### Accessibility Testing ✓/✗
- [ ] Cards are focusable via Tab key
- [ ] Enter key activates focused card
- [ ] Space key also activates card
- [ ] Focus indicators are clearly visible
- [ ] Screen reader announces card content and purpose
- [ ] Proper semantic markup

**Issues Found**: ___________  
**Notes**: ___________

---

## TC006: Modal Control Buttons

### Close Button Testing ✓/✗
- [ ] X icon displays correctly in top-right corner
- [ ] Button size is adequate (32px × 32px minimum)
- [ ] Hover effect shows gray background
- [ ] Click closes modal immediately
- [ ] Keyboard accessible (Tab, Enter)
- [ ] Escape key also closes modal

### Help Category Filter Testing ✓/✗
- [ ] Buttons display in horizontal row
- [ ] Wrap appropriately on mobile devices
- [ ] **Active state**: Red background, white text
- [ ] **Inactive state**: Gray border, black text
- [ ] **Hover state**: Gray background for inactive buttons
- [ ] Clicking filters help content immediately
- [ ] Smooth state transitions

### Help Item Expand/Collapse Testing ✓/✗
- [ ] Chevron down icon displays correctly (16px)
- [ ] Icon rotates 180° when expanded
- [ ] Content shows/hides smoothly
- [ ] Animation duration is appropriate (0.3s)
- [ ] Multiple items can be expanded independently
- [ ] Click anywhere on header expands/collapses

### Modal Overlay Testing ✓/✗
- [ ] Semi-transparent black background (50% opacity)
- [ ] Clicking outside modal closes it
- [ ] Body scrolling is prevented when modal open
- [ ] Focus is trapped within modal
- [ ] Modal appears above all other content

**Issues Found**: ___________  
**Notes**: ___________

---

## TC007: Cross-Browser Compatibility

### Desktop Browsers
| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|-------|
| Role Selection | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Login Button | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Language Toggle | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Navigation | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Modal Controls | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Hover Effects | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |
| Animations | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | |

### Mobile Testing
| Device | Browser | Touch | Responsive | Performance | Notes |
|--------|---------|-------|------------|-------------|-------|
| iPhone | Safari | ✓/✗ | ✓/✗ | ✓/✗ | |
| Android | Chrome | ✓/✗ | ✓/✗ | ✓/✗ | |
| iPad | Safari | ✓/✗ | ✓/✗ | ✓/✗ | |

---

## TC008: Performance Testing

### Response Time Testing ✓/✗
- [ ] Button clicks respond within 100ms
- [ ] Hover effects start within 50ms
- [ ] View transitions complete within 300ms
- [ ] Modal open/close within 200ms
- [ ] Form submissions complete within 5 seconds

### Animation Performance ✓/✗
- [ ] All animations run at 60fps
- [ ] No janky or stuttering animations
- [ ] Smooth performance on lower-end devices
- [ ] CSS transitions work correctly
- [ ] No layout thrashing during animations

### Memory Usage ✓/✗
- [ ] No memory leaks after extended use
- [ ] Event listeners are properly cleaned up
- [ ] Component unmounting works correctly
- [ ] Browser memory usage remains stable

**Performance Notes**: ___________

---

## TC009: Error Handling

### Network Error Testing ✓/✗
- [ ] Buttons remain functional during slow connections
- [ ] Form submissions handle network errors gracefully
- [ ] Appropriate error messages display
- [ ] Retry mechanisms work correctly
- [ ] Offline behavior is acceptable

### Invalid State Testing ✓/✗
- [ ] Disabled buttons cannot be activated
- [ ] Form validation prevents invalid submissions
- [ ] Error messages are clear and helpful
- [ ] Recovery from error states works
- [ ] Edge cases are handled properly

**Error Handling Notes**: ___________

---

## TC010: Accessibility Compliance

### Keyboard Navigation ✓/✗
- [ ] All buttons accessible via Tab key
- [ ] Logical tab order maintained
- [ ] Enter/Space keys activate buttons
- [ ] Arrow keys work in dropdowns/lists
- [ ] Focus indicators are visible and clear
- [ ] Focus trapping works in modals

### Screen Reader Testing ✓/✗
- [ ] Button purposes are announced clearly
- [ ] State changes are communicated
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Proper semantic markup used

### Color and Contrast ✓/✗
- [ ] Text meets WCAG AA standards (4.5:1 ratio)
- [ ] Focus indicators have sufficient contrast
- [ ] Hover states maintain readability
- [ ] Color is not the only way to convey information

**Accessibility Notes**: ___________

---

## Overall Test Summary

### Critical Issues Found
1. ___________
2. ___________
3. ___________

### Minor Issues Found
1. ___________
2. ___________
3. ___________

### Recommendations
1. ___________
2. ___________
3. ___________

### Test Completion
- [ ] All test cases completed
- [ ] Issues documented with screenshots
- [ ] Performance metrics recorded
- [ ] Accessibility compliance verified
- [ ] Cross-browser testing completed

**Overall Assessment**: ___________  
**Ready for Production**: Yes / No  
**Tester Signature**: ___________  
**Date Completed**: ___________

---

## Appendix: Test Data and Credentials

### Test Accounts
- **Student Email**: student@haw-landshut.de
- **Employee Email**: mitarbeiter@haw-landshut.de
- **Password**: Any password (demo mode)
- **Reset Code**: 123456

### Browser Versions Tested
- Chrome: ___________
- Firefox: ___________
- Safari: ___________
- Edge: ___________

### Screen Resolutions Tested
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Tools Used
- [ ] Browser Developer Tools
- [ ] Screen Reader (specify): ___________
- [ ] Color Contrast Analyzer
- [ ] Performance Monitoring Tools
- [ ] Accessibility Testing Tools

This comprehensive manual test checklist ensures thorough validation of all button functionality across the HAW Landshut Portal application.