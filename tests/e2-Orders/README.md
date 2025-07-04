# Epic: Order Management

---

## User Story 1: Manage an Order

**As a buyer user**  
I want to create an order and add/remove products from any source (search, category tree, starred, saved lists, "Buy it again")  
So I can build my order in the most convenient way.

### Acceptance Criteria

- **AC1.1:** The user can create an order.
- **AC1.2:** The user can add products from any source.
- **AC1.3:** The user can remove products from the order.
- **AC1.4:** The user can save the order as a list.

### Test Checklist

- [ ] The user can create an order in Draft state.
- [ ] The user can add products using the search.
- [ ] The user can add products from the category tree.
- [ ] The user can add products from Starred.
- [ ] The user can add products from Saved Lists.
- [ ] The user can add products from "Buy it again".
- [ ] The user can remove products from the order.
- [ ] The user can save the order as a list.

### Test Cases

**tc1.1:** Create empty order  
**Script:** `tc1.1-create-empty-order.spec.ts`  
Precondition: Authenticated user (buyer role).  
1. Click "Create order" from:
   • Open → + New order  
   • Browse → + New order  
   • Collapsed side menu → “+” icon  
   • Browse → top menu → active order selector → + New order  
   _The order modal opens in Draft state and displays the message “Your order is empty”, Add products to this draft order to get started._  
   _An order is automatically created with "Draft" status._  
   _The new order appears in the list with All and "Draft" filters:_  
   • Name Order 00XXX Draft  
   • Text 0 items  
   • Text Last updated now  

2. Click the "Back" button.  
   _Returns to the corresponding preview view:_  
   _If created from Browse, it is selected as active in the top menu._

**tc1.2:** Change the order name  
**Script:** `tc1.2-change-order-name.spec.ts`  
Precondition:  
_ Authenticated user (role Buyer, Manager, or Finance Manager)._  
_At least one order exists in Draft state._

1. Click an order from:
   • Orders → Open  
   • Orders → Sent  
   • Orders → History  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed.

2. Click the "Change order name" option.  
   - A text field with the current order name is enabled.  
3. Modify the name.  
   - When closing the modal, the new name is reflected in all views where the order appears (Open, Sent, History, and Browse).

**tc1.3:** Save the order as a list  
**Script:** `tc1.3-save-order-as-list.spec.ts`  
Precondition:  
_ Authenticated user (buyer role)._  
_At least one order exists in Draft state._  
1. Click an order from:
   • Orders → Open  
   • Orders → Sent  
   • Orders → History  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed.

2. Click the "Save order as list" option.  
   - The message "Saved list created" is displayed.  
   - The saved list is created with the items from the order.  
   - The list is available for future orders.

**tc1.4:** Cancel an order  
**Script:** `tc1.4-cancel-order.spec.ts`  
Precondition:  
_ Authenticated user (buyer role)._  
_At least one order exists in an open state (Draft, To manager, or To finance manager)._

1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed.

2. Click the "Discard" option.  
   - A dialog appears with the message "Are you sure you want to discard this draft order? This action cannot be undone."  
   - The Cancel and Discard buttons are displayed.

3. Click the Discard button.  
   - The message "Order deleted" is displayed.  
   - The "Undo" option is displayed.  
   - The Open orders view is shown and the order is removed from all views where it appeared.

4. Click the Cancel button  
   - Returns to the order view.

**tc1.5:** Restore discarded order  
**Script:** `tc1.5-restore-discarded-order.spec.ts`  
Precondition: The system has displayed the message "Order restored" and the "Undo" option is visible.  
1. Click the "Undo" button after discarding an order.  
   - The message "Order restored" is displayed.  
   - The deleted order is automatically restored with previous data.  
   - It is shown in the Open orders view.

**tc1.6:** View status history  
**Script:** `tc1.6-view-status-history.spec.ts`  
Precondition:  
_ Authenticated user (buyer role)._  
_At least one order exists with several historical states (e.g., Draft → Pending manager → Pending finance → Placed)._

1. Click an order from:
   • Orders → Open  
   • Orders → Sent  
   • Orders → History  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed.  
2. Click the button with the order status.  
   - The list of status events is displayed in ascending chronological order.  
   - Each event shows:  
     • Blue/green check icon (current).  
     • Text “<Status> by <Actor>”.  
     • Exact date and time of status change.  
3. Click to close the modal.  
   - Returns to the previous view.

**tc1.7:** Add product by search field  
**Script:** `tc1.7-add-product-by-search-field.spec.ts`  
Precondition:  
- Authenticated user with role Buyer, Manager, or Finance Manager (permission to modify the order).  
- Order in open state (Draft, Pending manager, or Pending finance manager) and open in the view.  
1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed  
   - "Search to add" field is visible.  
2. In the order view, type ≥ 3 characters in the "Search to add" field.  
   - A list of products matching the search is displayed.  
3. Click the desired product.  
   - The notification “Order line added” is displayed.  
4. Observe the order's product list.  
   - The selected item appears in the order.  
   - “− 1 +”, “Remove”, “Save”, “Add remark” buttons are active.  
   - “Continue to checkout (x items)” is enabled.

**tc1.8:** Add product by category  
**Script:** `tc1.8-add-product-by-category.spec.ts`  
Precondition:  
- Authenticated user with role Buyer, Manager, or Finance Manager (permission to modify the order).  
- Order in open state (Draft, Pending manager, or Pending finance manager) and open in the view.  
1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed  
1. Click the “Browse by category” icon.  
   - The right panel opens with a list of categories and subcategories.  
2. Navigate categories and/or → select subcategory → select item  
   - The category header updates as you navigate the tree.  
   - When selecting the item, the notification “Order line added” is displayed if the product did not exist in the order.  
   - The product appears in the order's product list, with quantity controls and available actions (“− N +”, “Remove”, “Save”, “Add remark”). N is the quantity.  
   - The “Continue to checkout (x items)” button is enabled if there is at least one product.

**tc1.9:** Add product by starred  
**Script:** `tc1.9-add-product-by-starred.spec.ts`  
Precondition:  
- Authenticated user with role Buyer, Manager, or Finance Manager (permission to modify the order).  
- Order in open state (Draft, Pending manager, or Pending finance manager) and open in the view.  
- There are products in “Starred”.  
1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed  
2. Click the “★” (Starred) icon.  
   - The right panel "Starred items" opens with products marked as favorites.  
3. Click the “+” button on a product if enabled.  
   - If the product did not exist in the order, the notification “Order line added” is displayed and the product appears at the top of the order.  
   - The product appears in the order's product list, with quantity controls and available actions (“− N +”, “Remove”, “Save”, “Add remark”), where N is the current quantity of the product in the order.  
4. Click the “X” icon to close the Starred panel.  
   - The favorites panel closes and the order view is displayed.

**tc1.10:** Add product by saved lists  
**Script:** `tc1.10-add-product-by-saved-lists.spec.ts`  
Precondition:  
- Authenticated user with role Buyer, Manager, or Finance Manager (permission to modify the order).  
- Order in open state (Draft, Pending manager, or Pending finance manager) and open in the view.  
- There are saved lists (“Saved Lists”) with products.  
Steps:  
1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed  
2. Click the “Saved Lists” icon or button.  
   - The right panel opens with the user's saved lists.  
3. Select a saved list.  
   - The products of the selected list are displayed.  
4. Click the “Add” button.  
   - The notification “Item added to order” is displayed and the product appears in the order.  
   - If the product is available, it appears in the order's product list, with quantity controls and available actions (“− N +”, “Remove”, “Save”, “Add remark”), where N is the current quantity of the product in the order.  
   - If the product is not available, it appears in the order's product list as "Out of stock", with available actions (“Remove”, “Save”, “Add remark”).  
5. Click the “X” icon to close the Saved Lists panel.  
   - The saved lists panel closes and the order view is displayed.

**tc1.11:** Add product by history orders  
**Script:** `tc1.11-add-product-by-history-orders.spec.ts`  
Precondition:  
- Authenticated user with role Buyer, Manager, or Finance Manager (permission to modify the order).  
- Order in open state (Draft, Pending manager, or Pending finance manager) and open in the view.  
- There are History orders with products.  
Steps:  
1. Click an order from:
   • Orders → Open  
   • Browse → top menu → active order selector → Click the order.  
   - The order is displayed  
2. Click the “History orders” icon or button.  
   - The right panel opens with the user's History orders.  
3. Select an order in the panel.  
   - The products of the selected order are displayed.  
4. Click the “Add” button.  
   - The notification “Item added to order” is displayed and the product appears in the order.  
   - If the product is available, it appears in the order's product list, with quantity controls and available actions (“− N +”, “Remove”, “Save”, “Add remark”), where N is the current quantity of the product in the order.  
   - If the product is not available, it appears in the order's product list as "Out of stock", with available actions (“Remove”, “Save”, “Add remark”).  
5. Click the “X” icon to close the History orders panel.  
   - The History orders panel closes and the order view is displayed.



